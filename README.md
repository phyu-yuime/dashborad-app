# メモ管理ダッシュボード

このプロジェクトは、**Next.js（React）** を使ったフロントエンドと、**Django REST Framework** を使ったバックエンドで構成された、ユーザーごとのメモ管理アプリケーションです。ユーザー登録・ログイン後、メモの作成・編集・削除が可能です。

---

## 主な機能

- ユーザー登録・ログイン（セッション認証 + CSRF保護）
- メモの作成・一覧表示・編集・削除（CRUD）
- Tailwind CSS + shadcn/ui を使ったダッシュボードUI
- 認証付きAPI通信（`credentials: include`）
- レスポンシブで使いやすいインターフェース

---

## 使用技術

| レイヤー     | 使用技術                         |
|--------------|----------------------------------|
| フロントエンド | Next.js, Tailwind CSS, TypeScript, shadcn/ui |
| バックエンド   | Django, Django REST Framework     |
| 認証         | セッション認証 + CSRFトークン     |
| データベース   | SQLite（初期設定）または PostgreSQL/MySQL（オプション） |

---

## セットアップ手順

### バックエンド（Django）

1. 仮想環境を作成 & 有効化:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows の場合: venv\Scripts\activate
