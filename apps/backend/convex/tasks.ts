import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * List all tasks ordered by creation time (newest first).
 */
export const listTasks = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('tasks'),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      completed: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    const tasks = await ctx.db.query('tasks').order('desc').collect();
    return tasks;
  },
});

/**
 * Create a new task.
 */
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      title: args.title,
      description: args.description,
      completed: false,
    });
    return taskId;
  },
});

/**
 * Update an existing task.
 */
export const updateTask = mutation({
  args: {
    id: v.id('tasks'),
    title: v.optional(v.string()),
    description: v.optional(v.nullable(v.string())),
    completed: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id } = args;
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const patchData: {
      title?: string;
      description?: string;
      completed?: boolean;
    } = {};

    if (args.title !== undefined) {
      patchData.title = args.title;
    }
    if (args.description !== undefined) {
      // Convert null to undefined since schema doesn't support null
      patchData.description = args.description ?? undefined;
    }
    if (args.completed !== undefined) {
      patchData.completed = args.completed;
    }

    await ctx.db.patch(id, patchData);
    return null;
  },
});

/**
 * Delete a task.
 */
export const deleteTask = mutation({
  args: {
    id: v.id('tasks'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error('Task not found');
    }
    await ctx.db.delete(args.id);
    return null;
  },
});
