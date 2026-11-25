import { employeeDirectoryPresentationData } from '../manager/employees/fixtures/employeeDirectoryPresentationData'

export const employeePresentationIdentity = employeeDirectoryPresentationData.find((record) => record.accountStatus === 'APPROVED') ?? null
