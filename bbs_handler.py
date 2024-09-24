from flask import Flask, jsonify, request
import json
import requests


app = Flask(__name__)
CONFIG = json.load(open("./api_config.json", "r", encoding="utf-8"))



@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    return response



@app.route('/api/send', methods=['POST'])
def send_content():
    try:
        data = request.json
    except Exception as e:
        print(e)
        return {"result": False, "info": "Failed to post the comment.", "warning": ""}
    
    topic_id = data["topic_id"]
    message = data["message"]
    user = None if "user" not in data.keys() else data["user"]
    print(user)
    
    user_warning = ""    
    try:            
        host = CONFIG[user]["HOST"]
        api_key = CONFIG[user]["API_KEY"]
        user_name = CONFIG[user]["USER_NAME"]
    except:
        if user is None:
            user_warning = "No reviewer user assigned. "
        else:
            user_warning = "Invalid user {} assigned. ".format(user)
        user = "VisBot"
        user_warning += "Switch to default reviewer user {} instead.".format(user)
        
        host = CONFIG[user]["HOST"]
        api_key = CONFIG[user]["API_KEY"]
        user_name = CONFIG[user]["USER_NAME"]
    
    print(user_name, "to post")    
    r = requests.post(
        url=f"{host}/posts.json",
        headers={
            "Api-Key": api_key,
            "Api-Username": user_name,
        }, 
        data={"topic_id": topic_id, "raw": message}
    )   
    
    if r.status_code == 200:
        return {"result": True, "info": "Comment posted successfully!", "warning": user_warning}
    else:
        return {"result": False, "info": "Failed to post the comment. [status code: {}]".format(r.status_code), "warning": user_warning}




if __name__ == '__main__':
    app.run()