import json
from time import time
from random import random
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from flask import Flask, render_template, make_response

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html', data='test')

@app.route('/live-data')
def live_data():
    # load data from elasticsearch
    # client = Elasticsearch()
    # s = Search(using=client, index="logstash*").filter("range", **{"@timestamp":{'gte': 'now-3s', 'lt': 'now'}})

    # s.execute()
    # Create a PHP array and echo it as JSON
    data = {}
    data['traffic'] = [time() * 1000, random() * 100]
    data['port'] = []
    i = 0
    while i < 5:
        data['port'].append([time() * 1000, random() * 10])
        i += 1
    response = make_response(json.dumps(data))
    response.content_type = 'application/json'
    return response

@app.route('/live-port')
def live_port():
    data = []
    i = 0
    while i < 5:
        data.append([time() * 1000, random() * 10])
        i += 1
    response = make_response(json.dumps(data))
    response.content_type = 'application/json'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=80)
