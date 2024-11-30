from flask import Flask, jsonify
from notion_client import Client
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import dotenv
import os
dotenv.load_dotenv()

NOTION_TOKEN=os.getenv('NOTION_API_KEY')
TASK_DATABASE_ID=os.getenv('NOTION_TASK_DB_ID')
PROJECT_DATABASE_ID=os.getenv('NOTION_PROJECT_DB_ID')

notion = Client(auth=NOTION_TOKEN)

def get_home_project_id():
    query = {
        "filter": {
            "property": "Project name",
            "title": {
                "equals": "Home"
            }
        }
    }
    response = notion.databases.query(**query, database_id=PROJECT_DATABASE_ID)
    if response['results']:
        return response['results'][0]['id']
    return None

def get_home_tasks(home_project_id):
    query = {
        "filter": {
            "property": "Project",
            "relation": {
                "contains": home_project_id
            }
        }
    }
    response = notion.databases.query(**query, database_id=TASK_DATABASE_ID)
    tasks = []
    def test_name(select):
        if select:
            return select['name']
        return None
    
    for result in response.get('results', []):
        task = {
            "name": result['properties']['Task name']['title'][0]['text']['content'],
            "priority": test_name(result['properties']['Priority']['select']),
            "status": result['properties']['Status']['status']['name'],
            "due_date": result['properties']['Due']['date']
        }
        tasks.append(task)
    return tasks

@app.route('/tasks/home', methods=['GET'])
def home_tasks():
    home_project_id = get_home_project_id()
    if home_project_id:
        tasks = get_home_tasks(home_project_id)
        return jsonify(tasks)
    else:
        return jsonify({"error": "Home project not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
