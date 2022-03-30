import { PROJECT_ROLE, ROLE, User } from '@prisma/client';
import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import writeXlsxFile from 'write-excel-file/node';
import { prisma } from '../app';
import ApiError from '../util/apiError';
import exclude from '../util/exclude';

export const create: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.create({
      data: {
        ...req.body,
      },
    });
    await prisma.user.update({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      data: {
        projects: {
          connect: {
            id: result.id,
          },
        },
      },
    });
    const participant = await prisma.participant.create({
      data: {
        // @ts-ignore
        userId: req.user.id,
        projectId: result.id,
        role: PROJECT_ROLE.OWNER,
      },
    });
    res.send({ result, participant });
  } catch (e) {
    next(new ApiError(400, e.toString()));
  }
};

export const addParticipant: RequestHandler = async (req, res, next) => {
  try {
    const conn = await prisma.participant.findFirst({
      where: {
        ...req.body,
      },
    });
    if (conn != null) {
      next(new ApiError(400, 'User already registered'));
      return;
    }
    await prisma.participant.create({
      data: req.body,
    });
    await prisma.user.update({
      where: {
        // @ts-ignore
        id: req.body.userId,
      },
      data: {
        projects: {
          connect: {
            id: req.body.projectId,
          },
        },
      }
    });

    const result = await prisma.project.findUnique({
      where: {
        id: req.body.projectId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    res.send(result);
  } catch (e) {
    next(new ApiError(400, e.toString()));
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.update({
      where: {
        id: req.body.id,
      },
      data: {
        ...req.body,
        id: undefined,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    res.send(result);
  } catch {
    next(new ApiError(400, 'error'));
  }
};

export const getUserProjects: RequestHandler = async (req, res) => {
  const user = req.user;
  //@ts-ignore
  if (user.role === ROLE.ADMIN) {
    res.send(
      await prisma.project.findMany({
        include: {
          participants: true,
        },
      })
    );
  } else {
    res.send(
      // @ts-ignore
      user.projects
    );
  }
};

export const getUniqueProject: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.findUnique({
      where: {
        code: +req.params.id,
      },
      include: {
        participants: {
          include: {
            user: true,
          }
        },
      },
    });
    if (result != null) {
      res.send(result);
    } else {
      next(new ApiError(400, 'project not found'));
    }
  } catch (e) {
    next(new ApiError(400, 'oops'));
  }
};

export const changeRole: RequestHandler = async (req, res) => {
  const newRole = req.body.role as PROJECT_ROLE;
  switch (newRole) {
    case PROJECT_ROLE.TEAM_LEAD:
      const teamLeadUser = await prisma.participant.findFirst({
        where: {
          projectId: req.body.projectId,
          role: PROJECT_ROLE.TEAM_LEAD,
        },
      });
      if (teamLeadUser != null) {
        await prisma.participant.update({
          where: {
            id: teamLeadUser.id,
          },
          data: {
            role: PROJECT_ROLE.PARTICIPANT,
          },
        });
      }
  }
  const user = await prisma.participant.update({
    where: {
      id: req.body.id,
    },
    data: {
      role: req.body.role as PROJECT_ROLE,
    },
  });

  res.send(
    await prisma.project.findUnique({
      where: {
        id: req.body.projectId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
  );
};

export const cyka: RequestHandler = async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: {
      code: +req.params.code,
    },
  });
  if (project.repo !== null && project.repo !== '') {
    const splittedRepo = project.repo.split('/').slice(-2);
    const commitsData = await fetch(
      `https://api.github.com/repos/${splittedRepo.join('/')}/commits`
    );
    const commits = await commitsData.json();
    const hash = commits.reduce((p: any, c: any) => {
      const key = c.author?.login ?? c.commit.author.name;
      return p[key] ? p[key].push(c) : (p[key] = [c]), p;
    }, {});
    const newData = Object.keys(hash).map((k) => {
      const data = hash[k].sort((a: any, b: any) => {
        const aDate = new Date(a.commit.author.date);
        const bDate = new Date(b.commit.author.date);
        //@ts-ignore
        return bDate - aDate;
      });
      return {
        login: k,
        commits: data,
      };
    });

    const response = [];
    for (const element of newData) {
      const user = await prisma.user.findFirst({
        where: {
          ghUsername: element.login,
        },
      });
      const timeDiff =
        //@ts-ignore
        new Date(element.commits[0].commit.author.date) -
        //@ts-ignore
        new Date(
          element.commits[element.commits.length - 1].commit.author.date
        );
      const metrics = {
        count: element.commits.length,
        time: timeDiff / 1000,
      };
      response.push({
        user: user ?? element.login,
        metrics,
      });
    }
    const data = [
      [
        { value: 'Name' },
        { value: 'Github Username' },
        { value: 'Commits count' },
        { value: 'Time, h' },
      ],
      ...response.map((e) => {
        let name;
        let gh;
        if (typeof e.user === 'string') {
          name = e.user;
          gh = '';
        } else {
          name = e.user.firstName + ' ' + e.user.lastName;
          gh = e.user.ghUsername;
        }
        return [
          { value: name },
          { value: gh },
          { value: e.metrics.count },
          { value: e.metrics.time / 60 / 60 },
        ];
      }),
    ];
    res.send(response);
  } else {
    next(new ApiError(400, 'No repository'));
  }
};

export const report: RequestHandler = async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: {
      code: +req.params.code,
    },
  });
  if (project.repo != null) {
    const splittedRepo = project.repo.split('/').slice(-2);
    const commitsData = await fetch(
      `https://api.github.com/repos/${splittedRepo.join('/')}/commits`
    );
    const commits = await commitsData.json();
    const hash = commits.reduce((p: any, c: any) => {
      const key = c.author?.login ?? c.commit.author.name;
      return p[key] ? p[key].push(c) : (p[key] = [c]), p;
    }, {});
    const newData = Object.keys(hash).map((k) => {
      const data = hash[k].sort((a: any, b: any) => {
        const aDate = new Date(a.commit.author.date);
        const bDate = new Date(b.commit.author.date);
        //@ts-ignore
        return bDate - aDate;
      });
      return {
        login: k,
        commits: data,
      };
    });

    const response = [];
    for (const element of newData) {
      const user = await prisma.user.findFirst({
        where: {
          ghUsername: element.login,
        },
      });
      const timeDiff =
        //@ts-ignore
        new Date(element.commits[0].commit.author.date) -
        //@ts-ignore
        new Date(
          element.commits[element.commits.length - 1].commit.author.date
        );
      const metrics = {
        count: element.commits.length,
        time: timeDiff / 1000,
      };
      response.push({
        user: user ?? element.login,
        metrics,
      });
    }
    const data = [
      [
        { value: 'Имя' },
        { value: 'Имя пользователя GitHub' },
        { value: 'Общее число коммитов' },
        { value: 'Время в часах' },
      ],
      ...response.map((e) => {
        let name;
        let gh;
        if (typeof e.user === 'string') {
          name = e.user;
          gh = '';
        } else {
          name = e.user.firstName + ' ' + e.user.lastName;
          gh = e.user.ghUsername;
        }
        return [
          { value: name },
          { value: gh },
          { value: e.metrics.count },
          { value: e.metrics.time / 60 / 60 },
        ];
      }),
    ];
    const filename = `reports/${project.name}.xlsx`;
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await writeXlsxFile(data, { filePath: filename });
    res.download(filename);
  } else {
    next(new ApiError(400, 'No repository'));
  }
};
