from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def default():
  data = [0]
  return render_template('index.html', data=data)


@app.errorhandler(404)
def page_not_found(e):
  return render_template('404.html'), 404


if __name__ == '__main__':
  app.run(host="0.0.0.0", port=8080, debug=True)