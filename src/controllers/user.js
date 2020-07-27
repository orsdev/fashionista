const express = require('express');

exports.getHomePage = async (req, res) => {
  res.render('home', { pageTitle: 'FASHIONIT | HOME' });
};

exports.postUserInfo = async (req, res) => {
  res.send('register user')
};
