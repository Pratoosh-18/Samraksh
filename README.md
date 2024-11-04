# Project Setup Guide

## Backend

- [Download VGG Face Weight](https://github.com/serengil/deepface_models/releases/download/v1.0/vgg_face_weights.h5)

- Put this into `backend/server/assets/models`

- Install Docker

- Build Image (Don't run for subsequent use)

  ```shell
  docker-compose build
  ```

- For Running

  ```shell
  docker-compose up -d
  ```

- For Stopping

  ```shell
  docker-compose down
  ```

## Frontend

- Install nodejs

- open frontend directory on terminal and write the following commands

  ```bash
  npm install
  ```

  ```bash
  npm run dev
  ```

## Output

- See it on http://localhost:5173/