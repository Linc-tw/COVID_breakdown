#!/bin/bash

MODE=${1}

echo "################################################################################"
echo "## Log - gadd.sh"
date
cd /home/linc/21_Codes/COVID_breakdown
echo

echo "## Add to repo"
echo

if [ "${MODE}" = "data" ]; then
  git add raw_data/**
  git add processed_data/**
else
  git add js/**
  git add page/**
  git add python/*.py
  git add css/plots.css
  git add gadd.sh
  git add download.sh
  git add index.html
  git add README.md
fi
echo

date
echo "## Log - gadd.sh"
echo "################################################################################"
