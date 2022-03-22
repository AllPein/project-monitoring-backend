import { ROLE } from '.prisma/client'

const rights: Map<string, string[]> = new Map()
rights.set(ROLE.ADMIN, ['allProjects'])
rights.set(ROLE.STUDENT, ['personalProjects'])
rights.set(ROLE.PROJECT_MANAGER, ['personalProjects', 'createProject'])

export {
  rights
}