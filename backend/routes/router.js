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

const upload = multer({
  limits: {
      fileSize: 1 * 1024 * 1024, 
  },
});

router.get('/images/:id', async (req, res) => {
  try {
      const image = await imageModel.findById(req.params.id);
      if (!image) {
          return res.status(404).send('Image not found.');
      }

      res.set('Content-Type', 'image/png');
      res.send(image.imageData);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image.');
  }
});

router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
      const file = req.file;
      if (!file) {
          return res.status(400).send('No file uploaded.');
      }

      const image = new imageModel({
          imageUrl: file.originalname,
          imageData: file.buffer,
      });

      await image.save();
      const imageUrl = `${req.protocol}://${req.get('host')}/images/${image._id}`;
      res.status(200).send({ imageUrl: imageUrl });
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image.');
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
  
      const imageId = imageUrl.split('/').pop();
  
      const image = await imageModel.findById(imageId);
      if (!image) {
        return res.status(404).json({ error: 'Image not found.' });
      }
  
      let template = fs.readFileSync(layoutPath, 'utf8');
  
      template = template.replace('{{Title}}', title);
      template = template.replace('{{content}}', editorContent);
      template = template.replace('{{footer}}', footer);
    template = template.replace('{{image}}', `<img src="data:image/png;base64,${image.imageData.toString('base64')}" alt="Logo" style="width: 150px; height: auto; object-fit: contain;" />`);
  
      res.setHeader('Content-Disposition', `attachment; filename=${templateId}_customized.html`);
      res.setHeader('Content-Type', 'text/html');
      res.send(template);
    } catch (error) {
      console.error('Error rendering and downloading template:', error);
      res.status(500).json({ error: 'Failed to render and download template.', error: error.message });
    }
  });



module.exports = router;