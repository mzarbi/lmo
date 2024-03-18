from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


@app.route('/datasources', methods=['GET'])
def get_datasources():
    with open('manifest.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)


app.run()
