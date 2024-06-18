import Listr from 'listr';

export const execute = (url, func, config) => {
  let taskData;
  const tasks = new Listr([
    {
      title: `Loading file '${url}'`,
      task: (_ctx, task) => func(url, config)
        .then((data) => {
          taskData = data;
        })
        .catch((e) => task.skip(`Fail load '${url}'. ${e.message}`)),
    },
  ]);
  return tasks.run()
    .then(() => taskData);
};

export default execute;