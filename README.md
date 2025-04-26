```markdown
# Multiuser LLM Chat App

## Overview
複数のユーザーが同時に一つのLLMとリアルタイムに会話できるチャットアプリケーションです。

## Tech Stack
- Frontend: Next.js, TypeScript, TailwindCSS, Socket.IO client
- Backend: Node.js, Express, Socket.IO, OpenAI API
- Infrastructure: Docker, docker-compose

## Setup
1. リポジトリをクローン
```
git clone <repo_url>
```
2. 環境変数を設定
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
3. Docker-compose で起動
```
docker-compose up --build
```
4. ブラウザで `http://localhost:3000` を開く

## Usage
1. 名前を入力して参加
2. `@sora` とメッセージに含めてAIを呼び出し

## License
MIT
```