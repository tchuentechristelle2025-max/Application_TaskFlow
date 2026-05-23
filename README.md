# TaskFlow - VTIL Examen Semestriel 1

Application de gestion de tâches pour la startup TaskFlow.

## Stack Technique
- **Frontend**: HTML5, Tailwind CSS 3.4, JavaScript Vanilla + Fetch API
- **Backend**: Django 5.0 + Django REST Framework
- **Base de données**: MySQL
- **Fonctionnalités**: CRUD complet, Mode sombre, Responsive, LocalStorage fallback

## Structure du projet
```
Taskflow/
├── backend/                 # API Django
│   ├── manage.py
│   ├── taskflow_project/    # Config Django
│   └── taskflow_api/        # App API
└── frontend/                # Interface HTML/Tailwind/JS
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

## Installation locale

### 1. Backend Django
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install django djangorestframework django-cors-headers mysqlclient
```

### 2. Configurer MySQL
Créer une base `taskflow_db` dans MySQL :
```sql
CREATEDATABASES taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```



### 3. Lancer les migrations
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 
```


### 4. Frontend
Ouvrir simplement `frontend/index.html` avec Live Server dans VSCode. 
L'app se connecte auto à l'API. Si le backend est offline, elle utilise LocalStorage.

## Déploiement
- **Frontend**: Netlify - drag & drop le dossier `frontend`
- **Backend**: Render - connecter le repo GitHub, build: `pip install -r requirements.txt`, start: `gunicorn taskflow_project.wsgi`

## Fonctionnalités implémentées
Conforme au sujet VTIL :
1. Ajouter une tâche
2. Afficher liste des tâches  
3. Marquer une tâche comme terminée
4. Modifier le statut d'une tâche
5. Supprimer une tâche
6. Sauvegarder des données
7. Catégories + filtrage
8. Mode sombre + Responsive + Animations
