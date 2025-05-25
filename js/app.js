const { createApp } = Vue;

createApp({
  data() {
    return {
      newTodo: '',
      todos: JSON.parse(localStorage.getItem('todos') || '[]')
    };
  },
  watch: {
    todos: {
      handler(val) {
        localStorage.setItem('todos', JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    addTodo() {
      const text = this.newTodo.trim();
      if (text) {
        this.todos.push({ id: Date.now(), text, completed: false, editing: false });
        this.newTodo = '';
      }
    },
    editTodo(todo) {
      todo.editing = true;
    },
    finishEdit(todo) {
      if (!todo.text.trim()) {
        this.removeTodo(this.todos.indexOf(todo));
      } else {
        todo.editing = false;
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    }
  }
}).mount('#app');
