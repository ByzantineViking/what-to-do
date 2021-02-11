export const formatTodo = (rawTodo: string) => {
    // Look for more than one space.
    const regex = /[ ]{2,}/gi;
    const todo = rawTodo?.replace(regex, " ");
    return todo;
};