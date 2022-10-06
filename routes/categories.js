var express = require('express');
var router = express.Router();
const yup = require('yup');
const { MongoClient } = require('mongodb');

const { validateSchema, categoriesSchema } = require('./schemas.yup');
const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const COLLECTION_NAME = 'categories';

router.get('/', async (req, res) => {
  const data = req.body;
  findDocuments(data, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, data, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
})
// ------------------------------------------------------------------------------------------------
// QUESTIONS 18
// ------------------------------------------------------------------------------------------------
router.get('/questions/18', async (req, res) => {
  const aggregate = [
    {
      $lookup: {
        from: 'products',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$$id', '$categoryId'] },
            },
          },
        ],
        as: 'categories-products(số lượng hàng trong mỗi danh mục)',
      },
    },
  ];
  const data = req.body;
  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, data, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
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
    const result = await findDocument(id, COLLECTION_NAME);

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
router.post('/', validateSchema(categoriesSchema), async (req, res) => {
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