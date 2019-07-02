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
    client = Elasticsearch()
    s = Search(using=client, index="logstash*").filter("exists", field="dst_ip").filter("range", **{"@timestamp":{'gte': 'now-3s', 'lt': 'now'}})

    response = s.execute()
    # Create a PHP array and echo it as JSON
    data = {}
    data['traffic'] = [time() * 1000, s.count()]
    data['port'] = []
    for hit in response:
        data['port'].append([time() * 1000, hit.dpt])
    print(len(data['port']))
    response = make_response(json.dumps(data))
    response.content_type = 'application/json'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='ec2-3-13-234-92.us-east-2.compute.amazonaws.com', port=80)
