const { createApp } = Vue;

createApp({
  data() {
    return {
      newTask: '',
      tasks: [],
      editing: null,
      editText: ''
    };
  },
  created() {
    const saved = localStorage.getItem('tasks');
    this.tasks = saved ? JSON.parse(saved) : [];
  },
  watch: {
    tasks: {
      handler(val) {
        localStorage.setItem('tasks', JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    addTask() {
      const text = this.newTask && this.newTask.trim();
      if (!text) return;
      this.tasks.push({ id: Date.now(), text, done: false });
      this.newTask = '';
    },
    startEdit(task) {
      this.editing = task.id;
      this.editText = task.text;
    },
    updateTask(task) {
      const text = this.editText && this.editText.trim();
      if (!text) return;
      task.text = text;
      this.editing = null;
      this.editText = '';
    },
    cancelEdit() {
      this.editing = null;
      this.editText = '';
    },
    deleteTask(task) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    },
    toggleDone(task) {
      task.done = !task.done;
    }
  }
}).mount('#app');
