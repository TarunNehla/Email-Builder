const  express = require('express');
const router = express.Router();
const imageModel = require('../models/imageModel')
const EmailTemplate = require('../models/emailTemplateModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
        const newImage = new imageModel({
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newImage.save();

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: newImage.imageUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
});

router.get('/getEmailLayout', (req, res) => {
    const layoutId = req.query.layout; 

    const layoutPath = path.join(__dirname, '..', 'layouts', `${layoutId}.html`);

    fs.access(layoutPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({
                success: false,
                message: 'Layout not found',
            });
        }

        fs.readFile(layoutPath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error reading layout file',
                    error: err.message,
                });
            }

            res.status(200).send(data); 
        });
    });
});

router.post('/uploadEmailConfig', async (req, res) => {
  const { templateId, layoutHtml, configData } = req.body;
  if (!templateId || !layoutHtml || !configData) {
      return res.status(400).json({ error: 'All fields are required: templateId, layoutHtml, and configData.' });
  }

  try {
      const template = await EmailTemplate.findOneAndUpdate(
          { templateId },
          { layoutHtml, configData },
          { new: true, upsert: true }
      );
      res.status(200).json({ message: 'Template saved successfully!', template });
  } catch (error) {
      res.status(500).json({ error: 'Failed to save template.', error: error.message });
  }
});

router.post('/renderAndDownloadTemplate', async (req, res) => {
  const { templateId, values, editorContent, title, footer, imageUrl } = req.body;
  console.log('imageUrl : ', imageUrl);
  if (!templateId || !values || !editorContent) {
    return res.status(400).json({ error: 'templateId, values, and editorContent are required.' });
  }

  try {
    const layoutPath = path.join(__dirname, '..', 'layouts/forDownload', `${templateId}.html`);

    if (!fs.existsSync(layoutPath)) {
      return res.status(404).json({ error: 'Template not found.' });
    }

    const layoutHtml = fs.readFileSync(layoutPath, 'utf-8');

    const customizedHtml = layoutHtml
      .replace('{{Title}}', title || 'Default Title')
      .replace('{{content}}', editorContent || '')
      .replace('{{footer}}', footer || '')
      .replace('{{image}}', imageUrl ? `<img src="../${imageUrl}" alt="Image"/>` : '');

    const downloadsDir = path.join(__dirname, '..', 'downloads');

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const filePath = path.join(downloadsDir, `${templateId}_customized.html`);

    fs.writeFileSync(filePath, customizedHtml);

    res.download(filePath, `${templateId}_customized.html`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ error: 'Failed to download file.' });
      }

      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error rendering and downloading template:', error);
    res.status(500).json({ error: 'Failed to render and download template.', message: error.message });
  }
});



module.exports = router;