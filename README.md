# Social Music App Upload Server

This server is designed to upload media files in addition to the main one located at https://github.com/Yevgeniy-Dan/social-music-upload-server.git

## How to Run the App Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/Yevgeniy-Dan/social-music-upload-server.git
   cd social-music-upload-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   - Create a `.env` file in the project root directory.
   - Set the following environment variables in the `.env` file:

   ```bash
    NODE_ENV=
    PORT=

    AWS_API_VERSION=
    AWS_ACCESS_KEY=
    AWS_SECRET_KEY=
    AWS_BUCKET=

   ```

4. **Start the server**

   ```bash
   npm start
   ```

   The server will start running on `http://localhost:${your_port}`.

## How to Run the App Using Docker

1. **Build the Docker image:**

   ```bash
   docker compose build
   ```

2. **Start the service:**

   ```bash
   docker compose up
   ```
