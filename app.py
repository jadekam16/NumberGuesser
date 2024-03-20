import os
from flask import Flask, send_from_directory, request, jsonify
import random

app = Flask(__name__, static_folder='frontend', static_url_path='')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        print(app.static_folder, path)
        return send_from_directory(app.static_folder, path)
    else:
        print(app.static_folder, 'index.html')
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/guess', methods=['POST'])
def guess():
    data = request.get_json()

    try:
        user_guess = int(data['guess'])
        user_limit = int(data['limit'])
    except ValueError:
        return jsonify({'error': 'Invalid input. Guess and limit must be integers.'}), 400

    # Generate random number within the specified limit and round it to the nearest integer
    randomNumber = int(random.uniform(1, user_limit + 1))

    if user_guess < randomNumber:
        feedback = "Too low!"
    elif user_guess > randomNumber:
        feedback = "Too high!"
    else:
        feedback = "Correct guess!"

    return jsonify({'feedback': feedback, 'randomNumber': None})


@app.route('/reset')
def reset():
    new_random_number = random.randint(1, 100)  # Generate a new random number
    return jsonify({'randomNumber': new_random_number})


if __name__ == '__main__':
    app.run(debug=True)
