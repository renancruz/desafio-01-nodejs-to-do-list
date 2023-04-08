import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const todos = database.select('todos')
      return res.end(JSON.stringify(todos))
    }

  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400)
                  .end(JSON.stringify({message: 'title is required'}))
      }

      if (!description) {
        return res.writeHead(400)
                  .end(JSON.stringify({message: 'description is required'}))
      }

      const todo = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('todos', todo)

      return res
        .writeHead(201)
        .end()
    }

  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select('todos')

      const task = tasks.find(task => task.id === id);

      if (!task) {
        res.writeHead(404).end(JSON.stringify({message: "id not exists"}))
      }

      database.delete('todos', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title,  description } = req.body

      if (!title) {
        return res.writeHead(400)
                  .end(JSON.stringify({message: 'title is required'}))
      }

      if (!description) {
        return res.writeHead(400)
                  .end(JSON.stringify({message: 'description is required'}))
      }

      const tasks = database.select('todos')

      const task = tasks.find(task => task.id === id);

      if (!task) {
        res.writeHead(404).end(JSON.stringify({message: "id not exists"}))
      }


      const taskUpdate = {
        title, 
        description, 
        updated_at: new Date()
      }

      database.update('todos', id, taskUpdate)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const completed_at  = new Date()

      const tasks = database.select('todos')

      const task = tasks.find(task => task.id === id);

      if (!task) {
        res.writeHead(404).end(JSON.stringify({message: "id not exists"}))
      }

      database.update('todos', id, {completed_at})

      return res.writeHead(204).end()
    }
  },
]