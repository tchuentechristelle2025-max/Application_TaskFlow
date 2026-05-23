# Application TaskFlow -Examen de fin de formation


## Structure de mon projet TaskFlow

Taskflow/
├── backend/                 
│   ├── manage.py
│   ├── taskflow_project/    
│   └── taskflow_api/        
└── frontend/                
    ├── index.html
    ├── css/style.css
    └── js/app.js


## Installation locale

### 1. Backend Django
dans powershell, faire:
  - cd backend
  - python -m venv env , pour creer l'environement virtuel
  - source env\Scripts\Activate, pour activer l'environement virtuel
  - pip install django djangorestframework django-cors-headers mysqlclient ou requirements.txt pour installer les dependances.


## 2. Configurer MySQL
Dans MYSQL créer une base `taskflow_db`:
  ensuite, effectuer la commande:
 - CREATE DATABASES taskflow_db ;
 - SHOWDATABASES




### 3. Lancer les migrations
Dans mon powershell, executer les commandes suivantes:
- python manage.py makemigrations, qui permet de scanner les models.py et créer un plan de modification pour la base 
- python manage.py migrate, prend tout les plans de migrations et les execute vraiment dans MYSQL
- python manage.py createsuperuser: pour creer un super utilisateur
- python manage.py runserver: pour lancer le serveur en local



### 4. Frontend
Ouvrir simplement `frontend/index.html` avec Live Server dans VSCode. 
L'app se connecte auto à l'API. 

## Déploiement et base de donnee utilisé
- **Frontend**: Netlify (Python , Django , Django REST Framework)
- **Backend**: Render ; (HTML5, TailwindCSS, JavaScript)
- **Base de données** : MySQL 
- **Outils** : Git, VSCode

## Les fonctionnalités implémentées

1. Ajouter une tâche
2. Afficher liste des tâches  
3. Marquer une tâche comme terminée
4. Modifier le statut d'une tâche
5. Supprimer une tâche
6. Sauvegarder des données
7. Catégories 
8.filtrage
9. Mode sombre 
10.Responsive 
11.Animations


### Pousser le code sur github

1. Initialiser Git avec:GitBash

  - git init: pour initialiser le projet
  - git branch -M main: pour se positionné sur la branche MAIN


2. Commit 1 - README + .gitignore

  - git add README.md .gitignore
  - git commit -m "docs: structure initiale du projet et README"

3. Commit 2 - Backend

  - git add backend/
  - git commit -m "feat: mise en place de l'API Django REST avec modeles Task et Category"

4. Commit 3 - Frontend

  - git add frontend/
  - git commit -m "feat: ajout interface responsive avec mode sombre et TailwindCSS"

5. Commit 4 - pour le reste des fichiers

   - git add .
   - git commit -m "chore: ajout configuration deploiement Render et Vercel"

6. Lie à ton dépôt GitHub
Remplacer le pseudo par ton pseudo GitHub :

### Dans GitBash
git remote add origin https://github.com/https://github.com/tchuentechristelle2025-m/TaskFlow.git


7. Pousser l'application sur GitHub

  - git push -u origin main
  ## le code se retrouve sur github et est accesible via le lien github