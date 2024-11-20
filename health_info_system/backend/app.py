# backend/app.py

from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS

from models import db, Users, Doctor, Country  # SQLAlchemy models

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)

# Allow CORS for frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://4499-37-151-33-201.ngrok-free.app"]}})


# -------------------- USER MANAGEMENT ROUTES --------------------

@app.route('/users', methods=['GET'])
def manage_users():
    users = Users.query.all()
    return render_template('users/list.html', users=users)


@app.route('/users/create', methods=['GET', 'POST'])
def create_user():
    if request.method == 'POST':
        email = request.form['email']
        name = request.form['name']
        surname = request.form['surname']
        phone = request.form['phone']
        cname = request.form['cname']

        if Users.query.get(email):
            return "User already exists!", 400

        # Validate cname exists
        country = Country.query.get(cname)
        if not country:
            return "Invalid country!", 400

        new_user = Users(email=email, name=name, surname=surname, phone=phone, cname=cname)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('manage_users'))

    countries = Country.query.all()
    return render_template('users/create.html', countries=countries)


@app.route('/users/update/<string:email>', methods=['GET', 'POST'])
def update_user(email):
    user = Users.query.get(email)
    if not user:
        return "User not found!", 404

    if request.method == 'POST':
        user.name = request.form['name']
        user.surname = request.form['surname']
        user.phone = request.form['phone']
        user.cname = request.form['cname']

        # Validate cname exists
        country = Country.query.get(user.cname)
        if not country:
            return "Invalid country!", 400

        db.session.commit()
        return redirect(url_for('manage_users'))

    countries = Country.query.all()
    return render_template('users/update.html', user=user, countries=countries)


@app.route('/users/delete/<string:email>', methods=['POST'])
def delete_user(email):
    user = Users.query.get(email)
    if not user:
        return "User not found!", 404

    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('manage_users'))


# -------------------- DOCTOR MANAGEMENT ROUTES --------------------

@app.route('/doctors', methods=['GET'])
def manage_doctors():
    doctors = Doctor.query.all()
    return render_template('doctors/list.html', doctors=doctors)


@app.route('/doctors/create', methods=['GET', 'POST'])
def create_doctor():
    if request.method == 'POST':
        email = request.form['email']
        degree = request.form['degree']
        salary = request.form['salary']

        if Doctor.query.get(email):
            return "Doctor already exists!", 400

        new_doctor = Doctor(email=email, degree=degree, salary=salary)
        db.session.add(new_doctor)
        db.session.commit()
        return redirect(url_for('manage_doctors'))

    return render_template('doctors/create.html')


@app.route('/doctors/update/<string:email>', methods=['GET', 'POST'])
def update_doctor(email):
    doctor = Doctor.query.get(email)
    if not doctor:
        return "Doctor not found!", 404

    if request.method == 'POST':
        doctor.degree = request.form['degree']
        doctor.salary = request.form['salary']
        db.session.commit()
        return redirect(url_for('manage_doctors'))

    return render_template('doctors/update.html', doctor=doctor)


@app.route('/doctors/delete/<string:email>', methods=['POST'])
def delete_doctor(email):
    doctor = Doctor.query.get(email)
    if not doctor:
        return "Doctor not found!", 404

    db.session.delete(doctor)
    db.session.commit()
    return redirect(url_for('manage_doctors'))


# -------------------- USER API ROUTES --------------------

@app.route('/api/users', methods=['GET'])
def api_get_users():
    users = Users.query.all()
    users_data = [
        {
            'email': user.email,
            'name': user.name,
            'surname': user.surname,
            'phone': user.phone,
            'cname': user.cname,
        } for user in users
    ]
    return jsonify({'users': users_data}), 200


@app.route('/api/users/<string:email>', methods=['GET', 'PUT', 'DELETE'])
def api_user(email):
    user = Users.query.get(email)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if request.method == 'GET':
        user_data = {
            'email': user.email,
            'name': user.name,
            'surname': user.surname,
            'phone': user.phone,
            'cname': user.cname,
        }
        return jsonify(user_data), 200

    if request.method == 'PUT':
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.surname = data.get('surname', user.surname)
        user.phone = data.get('phone', user.phone)
        user.cname = data.get('cname', user.cname)

        # Validate cname exists
        country = Country.query.get(user.cname)
        if not country:
            return jsonify({'message': 'Invalid country'}), 400

        try:
            db.session.commit()
            return jsonify({'message': 'User updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'An error occurred while updating the user'}), 500

    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200


# -------------------- DOCTOR API ROUTES --------------------

@app.route('/api/doctors', methods=['GET'])
def api_get_doctors():
    doctors = Doctor.query.all()
    doctors_data = [
        {
            'email': doctor.email,
            'degree': doctor.degree,
            'salary': doctor.salary,
        } for doctor in doctors
    ]
    return jsonify({'doctors': doctors_data}), 200


@app.route('/api/doctors/<string:email>', methods=['GET', 'PUT', 'DELETE'])
def api_doctor(email):
    doctor = Doctor.query.get(email)
    if not doctor:
        return jsonify({'message': 'Doctor not found'}), 404

    if request.method == 'GET':
        doctor_data = {
            'email': doctor.email,
            'degree': doctor.degree,
            'salary': doctor.salary,
        }
        return jsonify(doctor_data), 200

    if request.method == 'PUT':
        data = request.get_json()
        doctor.degree = data.get('degree', doctor.degree)
        doctor.salary = data.get('salary', doctor.salary)
        try:
            db.session.commit()
            return jsonify({'message': 'Doctor updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'An error occurred while updating the doctor'}), 500

    if request.method == 'DELETE':
        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor deleted successfully'}), 200


# -------------------- COUNTRY API ROUTES --------------------

@app.route('/api/countries', methods=['GET'])
def api_get_countries():
    countries = Country.query.all()
    countries_data = [{'cname': country.cname, 'population': country.population} for country in countries]
    return jsonify({'countries': countries_data}), 200


# -------------------- HOME ROUTE --------------------

@app.route('/')
def index():
    return render_template('index.html')  # Or redirect to '/users' or '/doctors'


if __name__ == '__main__':
    app.run(debug=True)
