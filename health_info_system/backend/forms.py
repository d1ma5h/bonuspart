# forms.py
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, SelectField, DateField
from wtforms.validators import DataRequired, Length, Email


class UserForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    name = StringField('Name', validators=[DataRequired()])
    surname = StringField('Surname', validators=[DataRequired()])
    phone = StringField('Phone', validators=[DataRequired()])
    cname = SelectField('Country', choices=[], validators=[DataRequired()])


class DoctorForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), Length(max=60)])
    degree = StringField('Degree', validators=[DataRequired(), Length(max=20)])
    salary = IntegerField('Salary', validators=[DataRequired()])
    submit = SubmitField('Submit')


class PublicServantForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), Length(max=60)])
    department = StringField('Department', validators=[DataRequired(), Length(max=50)])
    salary = IntegerField('Salary', validators=[DataRequired()])
    submit = SubmitField('Submit')
