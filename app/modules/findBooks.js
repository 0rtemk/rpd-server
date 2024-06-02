const express = require('express');
const axios = require('axios');

const findBooks = async (req, res) => {
  try {
    const { bookName } = req.body;
    if (!bookName) return res.status(400).send('Book name is required');
    const libraryApi = `https://lib.uni-dubna.ru/MegaPro/API?Method=LIC_Search&query=${bookName}&inFulltext=false&limit=20`
    const response = await axios.get(libraryApi);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during book search:', error);
    res.status(500).send('Server error occurred while searching for books');
  }
};

module.exports = findBooks;