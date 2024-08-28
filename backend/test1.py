#flask_jwt_extended

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from datetime import timedelta

app = Flask(__name__)
app.config.from_object('config.Config')

# JWT Setup
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

mongo = PyMongo(app)
users_collection = mongo.db.users

# Register route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='bcrypt')
    
    user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password
    }
    
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 409

    users_collection.insert_one(user)
    
    return jsonify({'message': 'Registered successfully!'}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401

    access_token = create_access_token(identity=user['email'])
    refresh_token = create_refresh_token(identity=user['email'])
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token
    })

# Token Refresh route
@app.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({'access_token': new_access_token})

# Protected route
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = users_collection.find_one({'email': current_user})
    return jsonify({'message': f'Welcome {user["name"]}!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
