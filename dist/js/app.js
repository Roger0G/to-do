const { createApp } = Vue;

createApp({
  data() {
    return {
      newTask: '',
      tasks: []
    };
  },
  created() {
    this.loadTasks();
  },
  methods: {
    addTask() {
      const text = this.newTask.trim();
      if (!text) return;
      this.tasks.push({ id: Date.now(), text, completed: false, editing: false });
      this.newTask = '';
      this.saveTasks();
    },
    editTask(task) {
      task.editing = true;
    },
    finishEdit(task) {
      task.editing = false;
      this.saveTasks();
    },
    deleteTask(task) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.saveTasks();
    },
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    loadTasks() {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        this.tasks = JSON.parse(saved);
      }
    }
  }
}).mount('#app');
