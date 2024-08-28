#OG file

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson.objectid import ObjectId

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'TarangCloud-Aug-2024-Mani'  # Change this to a secure key
jwt = JWTManager(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Tarang-web']
collection = db['Client']

@app.route("/")
def hello_world():  
    return "<p>Hello, World!</p>"

@app.route('/register', methods=['GET', 'POST'])
def register():

    userData = request.json  
    print(userData)  

    phoneNumber = userData.get('phonenumber')
    email = userData.get('email')
    userName = userData.get('username')
    password = userData.get('password')

    existing_user = collection.find_one({
        '$or': [
            {'phonenumber':phoneNumber},
            {'email':email},
            {'username':userName}
        ]
    })

    if existing_user:
        if existing_user.get('phonenumber') == phoneNumber:
            message = 'Phone number already exists'
        elif existing_user.get('email') == email:
            message = 'Email already exists'
        else:
            message = 'Username already exists'
    
        return jsonify({'status': 'error', 'message': message}), 409
    
    if password:
        pwd_hashed = bcrypt.generate_password_hash(password)
        userData['password'] = pwd_hashed
    
    data = collection.insert_one(userData)
    return jsonify({'status': 'success', 'inserted_id': str(data.inserted_id)})

@app.route('/login', methods=['GET', 'POST'])
def Login():
    LoginUserData = request.json
    userName = LoginUserData.get('username')
    password = LoginUserData.get('password')

    user = collection.find_one({"username": userName})
    print(LoginUserData)
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": user['typeofuser']})
        return jsonify(access_token=access_token, role=user['typeofuser'], message = "Login successful!"), 200
    else:
        return ({'status': 'error', 'message': 'Invalide User Name or Password'}), 409
    
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(current_user)})
    return jsonify(logged_in_as=user['username'], role=user['role'])

if __name__ == "__main__":
    app.run(debug=True)

#rsa256