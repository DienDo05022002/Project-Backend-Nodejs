var express = require('express');
var router = express.Router();
const yup = require('yup');
const { MongoClient } = require('mongodb');
// const { ObjectId } = require('mongodb');

const { validateSchema, customersSchema } = require('./schemas.yup');
const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const COLLECTION_NAME = 'customers';

router.get('/', async (req, res) => {
  const data = req.body;
  findDocuments(data, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true , data , result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 4
// ------------------------------------------------------------------------------------------------
router.get('/questions/4', function (req, res) {
  const text = 'Hải Châu';
  const query = { address: {$regex:`${text}`} };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 5
// ------------------------------------------------------------------------------------------------
router.get('/questions/5', function (req, res) {
  const query = {
    $expr: {
      $eq: [{ $year: '$birthday' }, 1990],
    },
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 6
// ------------------------------------------------------------------------------------------------
router.get('/questions/6', function (req, res) {
  const today = new Date();
  const query = {
    $expr: {
      $and: [{ $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] }, { $eq: [{ $month: '$birthday' }, { $month: today }] }],
    }
  };
  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
// TÌM THEO ID
const getByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});

router.get('/:id', validateSchema(getByIdSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await findDocument(id , COLLECTION_NAME);

    if (result) {
      res.json({ ok: true, result });
    } else {
      res.json({ ok: false, result });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// THÊM MỚI
router.post('/', validateSchema(customersSchema), async (req, res) => {
  try {
    const data = req.body;
    const result = await insertDocument(data, COLLECTION_NAME);
    res.status(201).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// SỬA
router.patch('/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const result = await updateDocument(id, data, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// XÓA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;