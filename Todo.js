var Todo = (function () {
    function Todo(title, content, time) {
        this.title = title;
        this.time = time;
        this.content = content;
        this.status = -1;
    }
    return Todo;
}());

module.exports = Todo;