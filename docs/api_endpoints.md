# API AWM.Service

## Endpoints

| method | route | route params | query params | body (type/source) | response (type/notes) |
| --- | --- | --- | --- | --- | --- |
| GET | api/v{version:apiVersion}/academic-programs | - | departmentId: int?; degreeLevelId: int?; code: string?; name: string?; includeDeleted: bool | - | IReadOnlyList<AcademicProgramResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/academic-programs | - | - | CreateAcademicProgramRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/academic-programs/{id} | id: int | - | UpdateAcademicProgramRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/works/{workId:long}/Attachments | workId: long | - | - | IReadOnlyList<AttachmentResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/works/{workId:long}/Attachments/{attachmentId:long} | workId: long; attachmentId: long | - | - | AttachmentResponse / Ok (200) |
| POST | api/v{version:apiVersion}/works/{workId:long}/Attachments | workId: long | - | UploadAttachmentRequest / form | long / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/works/{workId:long}/Attachments/{attachmentId:long}/download | workId: long; attachmentId: long | - | - | file / File (200) |
| DELETE | api/v{version:apiVersion}/works/{workId:long}/Attachments/{attachmentId:long} | workId: long; attachmentId: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Auth/login | - | - | LoginRequest / body | LoginResponse / Ok (200) |
| POST | api/v{version:apiVersion}/Auth/refresh-token | - | - | RefreshTokenRequest / body | LoginResponse / Ok (200) |
| POST | api/v{version:apiVersion}/Auth/register | - | - | RegisterRequest / body | int / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/commissions | - | departmentId: int; academicYearId: int | - | IReadOnlyList<CommissionDto> / Ok (200) |
| GET | api/v{version:apiVersion}/commissions/{id:int} | id: int | - | - | CommissionDetailDto / Ok (200) |
| POST | api/v{version:apiVersion}/commissions | - | - | CreateCommissionRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/commissions/{id:int} | id: int | - | UpdateCommissionRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/commissions/{id:int}/members | id: int | - | AddCommissionMemberRequest / body | int / CreatedAtAction (201) |
| DELETE | api/v{version:apiVersion}/commissions/{id:int}/members/{memberId:int} | id: int; memberId: int | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/defense-schedule | - | commissionId: int | - | IReadOnlyList<ScheduleResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/defense-schedule/{slotId:long} | slotId: long | - | - | DefenseSlotResponse / Ok (200) |
| POST | api/v{version:apiVersion}/defense-schedule | - | - | CreateDefenseScheduleRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/defense-schedule/{scheduleId:long} | scheduleId: long | - | UpdateDefenseScheduleRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/defense-schedule/{scheduleId:long}/assign | scheduleId: long | - | AssignWorkToSlotRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/degree-levels | - | name: string?; minDurationYears: int?; maxDurationYears: int? | - | IReadOnlyList<DegreeLevelResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/degree-levels | - | - | CreateDegreeLevelRequest / body | int / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/institutes/{instituteId}/departments | instituteId: int | - | - | IReadOnlyList<DepartmentResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/institutes/{instituteId}/departments | instituteId: int | - | CreateDepartmentRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Departments/{departmentId} | departmentId: int | - | UpdateDepartmentRequest / body | empty / NoContent (204) |
| DELETE | api/v{version:apiVersion}/Departments/{departmentId} | departmentId: int | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Directions/by-department | - | departmentId: int; academicYearId: int; workTypeId: int?; stateId: int?; supervisorId: int?; includeDeleted: bool | - | IReadOnlyList<DirectionResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Directions/by-supervisor | - | supervisorId: int; academicYearId: int; workTypeId: int?; stateId: int?; includeDeleted: bool | - | IReadOnlyList<DirectionResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Directions/{id} | id: long | includeDeleted: bool | - | DirectionDetailResponse / Ok (200) |
| POST | api/v{version:apiVersion}/Directions | - | - | CreateDirectionRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Directions/{id} | id: long | - | UpdateDirectionRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Directions/{id}/submit | id: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Directions/{id}/approve | id: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Directions/{id}/reject | id: long | - | RejectDirectionRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Directions/{id}/request-revision | id: long | - | RequestRevisionRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/evaluation/criteria | - | workTypeId: int; departmentId: int? | - | IReadOnlyList<EvaluationCriteriaResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/evaluation/schedule/{scheduleId:long}/grades | scheduleId: long | - | - | IReadOnlyList<GradeResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/evaluation/schedule/{scheduleId:long}/grades | scheduleId: long | - | SubmitGradeRequest / body | long / StatusCode (201) |
| PUT | api/v{version:apiVersion}/evaluation/schedule/{scheduleId:long}/finalize | scheduleId: long | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Institutes | - | universityId: int; includeDepartments: bool | - | IReadOnlyList<InstituteResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Institutes/{instituteId} | instituteId: int | includeDepartments: bool | - | InstituteResponse / Ok (200) |
| POST | api/v{version:apiVersion}/Institutes | - | - | CreateInstituteRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Institutes/{instituteId} | instituteId: int | - | UpdateInstituteRequest / body | empty / NoContent (204) |
| DELETE | api/v{version:apiVersion}/Institutes/{instituteId} | instituteId: int | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Notifications | - | skip: int; take: int; onlyUnread: bool? | - | NotificationListResponse / Ok (200) |
| PATCH | api/v{version:apiVersion}/Notifications/{notificationId:long}/read | notificationId: long | - | - | empty / NoContent (204) |
| PATCH | api/v{version:apiVersion}/Notifications/read-all | - | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Notifications/unread-count | - | - | - | int / Ok (200) |
| GET | api/v{version:apiVersion}/departments/{departmentId}/Periods | departmentId: int | academicYearId: int | - | IReadOnlyList<PeriodResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/departments/{departmentId}/Periods/active | departmentId: int | academicYearId: int; stage: WorkflowStage? | - | PeriodResponse / Ok (200) |
| POST | api/v{version:apiVersion}/departments/{departmentId}/Periods | departmentId: int | - | CreatePeriodRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/departments/{departmentId}/Periods/{periodId} | departmentId: int; periodId: int | - | UpdatePeriodRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/departments/{departmentId}/Periods/approve-initial | departmentId: int | academicYearId: int | ApproveInitialPeriodsRequest / body (Upsert) | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/pre-defense/schedule | - | commissionId: int | - | IReadOnlyList<PreDefenseScheduleDto> / Ok (200) |
| GET | api/v{version:apiVersion}/pre-defense/works/{workId:long}/attempts | workId: long | - | - | IReadOnlyList<PreDefenseAttemptDto> / Ok (200) |
| POST | api/v{version:apiVersion}/pre-defense/works/{workId:long}/schedule | workId: long | - | SchedulePreDefenseRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/pre-defense/attempts/{attemptId:long}/attendance | attemptId: long | - | RecordAttendanceRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/pre-defense/schedule/{scheduleId:long}/grades | scheduleId: long | - | SubmitPreDefenseGradeRequest / body | long / StatusCode (201) |
| PUT | api/v{version:apiVersion}/pre-defense/attempts/{attemptId:long}/finalize | attemptId: long | - | FinalizePreDefenseRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/protocols/{protocolId:long} | protocolId: long | - | - | ProtocolResponse / Ok (200) |
| POST | api/v{version:apiVersion}/protocols | - | - | GenerateProtocolRequest / body | long / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/quality-checks/by-work/{workId:long} | workId: long | - | - | IReadOnlyList<QualityCheckDto> / Ok (200) |
| GET | api/v{version:apiVersion}/quality-checks/pending | - | departmentId: int; academicYearId: int; checkType: CheckType? | - | IReadOnlyList<QualityCheckDto> / Ok (200) |
| POST | api/v{version:apiVersion}/quality-checks/works/{workId:long}/submit | workId: long | - | SubmitForCheckRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/quality-checks/works/{workId:long}/checks/{checkId:long}/record | workId: long; checkId: long | - | RecordCheckResultRequest / body | long / Ok (200) |
| GET | api/v{version:apiVersion}/works/{workId:long}/Reviews | workId: long | - | - | WorkReviewsResponse / Ok (200) |
| POST | api/v{version:apiVersion}/works/{workId:long}/Reviews/supervisor | workId: long | - | CreateSupervisorReviewRequest / form | long / Ok (200) |
| POST | api/v{version:apiVersion}/works/{workId:long}/Reviews/external/{reviewId:long} | workId: long; reviewId: long | - | UploadReviewRequest / form | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Staff | - | departmentId: int | - | IReadOnlyList<StaffResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Staff/supervisors | - | departmentId: int | - | IReadOnlyList<StaffResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/Staff | - | - | CreateStaffRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Staff/{staffId} | staffId: int | - | UpdateStaffRequest / body | empty / NoContent (204) |
| PATCH | api/v{version:apiVersion}/Staff/{staffId}/workload | staffId: int | - | UpdateStaffWorkloadRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Staff/approve-supervisors | - | - | ApproveSupervisorsRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Students/{studentId} | studentId: int | - | - | StudentResponse / Ok (200) |
| GET | api/v{version:apiVersion}/Students | - | programId: int | - | IReadOnlyList<StudentResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/Students | - | - | CreateStudentRequest / body | int / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Students/{studentId} | studentId: int | - | UpdateStudentRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/works/supervisor/{supervisorId:int} | supervisorId: int | academicYearId: int? | - | IReadOnlyList<StudentWorkResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/works/{id:long} | id: long | - | - | StudentWorkDetailResponse / Ok (200) |
| GET | api/v{version:apiVersion}/works/by-department | - | departmentId: int; academicYearId: int | - | IReadOnlyList<StudentWorkResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/works/my | - | - | - | IReadOnlyList<StudentWorkResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/works | - | - | CreateStudentWorkRequest / body | long / CreatedAtAction (201) |
| POST | api/v{version:apiVersion}/works/{workId:long}/participants | workId: long | - | AddParticipantRequest / body | long / CreatedAtAction (201) |
| DELETE | api/v{version:apiVersion}/works/{workId:long}/participants/{studentId:int} | workId: long; studentId: int | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/applications | - | - | CreateApplicationRequest / body | long / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/applications/by-topic/{topicId:long} | topicId: long | status: ApplicationStatus? | - | IReadOnlyList<TopicApplicationResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/applications/my | - | academicYearId: int? | - | IReadOnlyList<TopicApplicationResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/applications/{applicationId:long}/accept | applicationId: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/applications/{applicationId:long}/reject | applicationId: long | - | RejectApplicationRequest / body | empty / NoContent (204) |
| DELETE | api/v{version:apiVersion}/applications/{applicationId:long} | applicationId: long | - | - | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Topics/{id} | id: long | - | - | TopicDetailResponse / Ok (200) |
| GET | api/v{version:apiVersion}/Topics/available | - | departmentId: int?; academicYearId: int? | - | IReadOnlyList<TopicResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Users/me | - | - | - | UserProfileResponse / Ok (200) |
| GET | api/v{version:apiVersion}/WorkTypes | - | - | - | IReadOnlyList<WorkTypeResponse> / Ok (200) |
| GET | api/v{version:apiVersion}/Topics/by-direction/{directionId} | directionId: long | - | - | IReadOnlyList<TopicResponse> / Ok (200) |
| POST | api/v{version:apiVersion}/Topics | - | - | CreateTopicRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/Topics/{id} | id: long | - | UpdateTopicRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Topics/{id}/approve | id: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Topics/{id}/close | id: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Topics/{id}/deactivate | id: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Topics/submit-for-approval | - | - | SubmitTopicsForApprovalRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/Topics/bulk-approve | - | - | BulkApproveTopicsRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/Topics/coordination-summary | - | departmentId: int; academicYearId: int | - | TopicCoordinationSummaryResponse / Ok (200) |
| POST | api/v{version:apiVersion}/Topics/complete-coordination | - | - | CompleteTopicCoordinationRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/departments/{departmentId}/Periods/approve-defense | departmentId: int | academicYearId: int | ApproveDefensePeriodsRequest / body | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/pre-defense/distribute | - | - | DistributeStudentsRequest / body | empty / Ok (200) |
| POST | api/v{version:apiVersion}/pre-defense/generate-slots | - | - | GeneratePreDefenseSlotsRequest / body | empty / Ok (200) |
| PUT | api/v{version:apiVersion}/pre-defense/schedule/{scheduleId:long}/start-reconciliation | scheduleId: long | - | - | empty / NoContent (204) |
| POST | api/v{version:apiVersion}/pre-defense/protocols | - | - | GeneratePreDefenseProtocolRequest / body | long / CreatedAtAction (201) |
| GET | api/v{version:apiVersion}/pre-defense/failed-students | - | departmentId: int; academicYearId: int; preDefenseNumber: int? | - | IReadOnlyList<FailedPreDefenseStudentDto> / Ok (200) |
| POST | api/v{version:apiVersion}/quality-checks/assign-experts | - | - | AssignExpertsRequest / body | empty / Ok (200) |
| POST | api/v{version:apiVersion}/works/{workId:long}/assign-reviewer | workId: long | - | AssignReviewerToWorkRequest / body | long / CreatedAtAction (201) |
| PUT | api/v{version:apiVersion}/works/{workId:long}/repository-url | workId: long | - | SetRepositoryUrlRequest / body | empty / NoContent (204) |
| GET | api/v{version:apiVersion}/works/{workId:long}/assigned-reviewer | workId: long | - | - | AssignedReviewerDto / Ok (200) |
| GET | api/v{version:apiVersion}/works/review-status | - | departmentId: int; academicYearId: int | - | ReviewStatusByDepartmentDto / Ok (200) |
| GET | api/v{version:apiVersion}/works/defense-readiness | - | departmentId: int; academicYearId: int | - | DefenseReadinessDto / Ok (200) |
| GET | api/v{version:apiVersion}/works/admitted-students | - | departmentId: int; academicYearId: int | - | IReadOnlyList<AdmittedStudentDto> / Ok (200) |
| POST | api/v{version:apiVersion}/works/send-readiness-reminders | - | - | SendReadinessRemindersRequest / body | int / Ok (200) |
| POST | api/v{version:apiVersion}/defense-schedule/generate-slots | - | - | GenerateDefenseSlotsRequest / body | int / Ok (200) |
| PUT | api/v{version:apiVersion}/defense-schedule/{scheduleId:long}/start-reconciliation | scheduleId: long | - | - | empty / NoContent (204) |

## Request Body Schemas

### AddCommissionMemberRequest

- UserId: int
- RoleInCommission: RoleInCommission

### AddParticipantRequest

- StudentId: int
- Role: ParticipantRole

### BulkApproveTopicsRequest

- TopicIds: IReadOnlyList\<long\>

### CompleteTopicCoordinationRequest

- DepartmentId: int
- AcademicYearId: int

### ApproveDefensePeriodsRequest

- Periods: IReadOnlyList<PeriodDto>

### ApproveInitialPeriodsRequest

- Periods: IReadOnlyList<PeriodDto>

### ApproveSupervisorsRequest

- DepartmentId: int
- StaffIds: IReadOnlyList<int>

### AssignExpertsRequest

- DepartmentId: int
- Assignments: IReadOnlyList\<ExpertAssignmentItem\>

### ExpertAssignmentItem

- UserId: int
- ExpertiseType: ExpertiseType

### AssignReviewerToWorkRequest

- ReviewerId: int

### AssignWorkToSlotRequest

- WorkId: long

### CreateAcademicProgramRequest

- DepartmentId: int
- DegreeLevelId: int
- Code: string?
- Name: string

### CreateApplicationRequest

- TopicId: long
- MotivationLetter: string?

### CreateCommissionRequest

- DepartmentId: int
- AcademicYearId: int
- CommissionType: CommissionType
- Name: string?
- PreDefenseNumber: int?

### CreateDefenseScheduleRequest

- CommissionId: int
- DefenseDate: DateTime
- Location: string?

### DistributeStudentsRequest

- DepartmentId: int
- AcademicYearId: int
- PreDefenseNumber: int

### CreateDegreeLevelRequest

- Name: string
- DurationYears: int

### CreateDepartmentRequest

- InstituteId: int
- Name: string
- Code: string?

### CreateDirectionRequest

- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?

### CreateInstituteRequest

- UniversityId: int
- Name: string

### CreatePeriodRequest

- DepartmentId: int
- AcademicYearId: int
- WorkflowStage: WorkflowStage
- StartDate: DateTime
- EndDate: DateTime

### CreateStaffRequest

- UserId: int
- DepartmentId: int
- Position: string?
- AcademicDegree: string?
- IsSupervisor: bool
- MaxStudentsLoad: int

### CreateStudentRequest

- UserId: int
- ProgramId: int
- AdmissionYear: int
- CurrentCourse: int
- GroupCode: string?

### CreateStudentWorkRequest

- TopicId: long? (required — standalone works not supported)
- AcademicYearId: int
- DepartmentId: int
- StudentId: int (**required** — Edu.Students.Id, NOT Auth.Users.Id)

### CreateSupervisorReviewRequest

- ReviewText: string
- File: IFormFile?

### CreateTopicRequest

- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- DirectionId: long?
- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?
- MaxParticipants: int

### FinalizePreDefenseRequest

- AverageScore: decimal
- IsPassed: bool

### GenerateProtocolRequest

- ScheduleId: long
- CommissionId: int

### GenerateDefenseSlotsRequest

- CommissionId: int
- Date: DateTime
- StartTime: TimeSpan
- EndTime: TimeSpan
- SlotDurationMinutes: int
- Location: string?

### GeneratePreDefenseProtocolRequest

- CommissionId: int
- SessionDate: DateTime

### GeneratePreDefenseSlotsRequest

- CommissionId: int
- Date: DateTime
- StartTime: TimeSpan
- EndTime: TimeSpan
- SlotDurationMinutes: int
- Location: string?

### LoginRequest

- Login: string
- Password: string

### RefreshTokenRequest

- RefreshToken: string

### RecordAttendanceRequest

- AttendanceStatus: AttendanceStatus
- IsExcused: bool

### RecordCheckResultRequest

- IsPassed: bool
- ResultValue: decimal?
- Comment: string?
- DocumentPath: string?

### RegisterRequest

- Login: string
- Email: string
- Password: string
- UniversityId: int

### RejectApplicationRequest

- RejectReason: string

### RejectDirectionRequest

- Comment: string?

### RequestRevisionRequest

- Comment: string

### SchedulePreDefenseRequest

- CommissionId: int
- DefenseDate: DateTime
- Location: string?

### SendReadinessRemindersRequest

- DepartmentId: int
- AcademicYearId: int

### SetRepositoryUrlRequest

- RepositoryUrl: string

### SubmitForCheckRequest

- CheckType: CheckType
- Comment: string?

### SubmitTopicsForApprovalRequest

- TopicIds: IReadOnlyList\<long\>

### SubmitGradeRequest

- MemberId: int
- CriteriaId: int
- Score: int
- Comment: string?

### SubmitPreDefenseGradeRequest

- MemberId: int
- CriteriaId: int
- Score: int
- Comment: string?

### UpdateAcademicProgramRequest

- Code: string?
- Name: string

### UpdateCommissionRequest

- Name: string

### UpdateDefenseScheduleRequest

- DefenseDate: DateTime?
- Location: string?

### UpdateDepartmentRequest

- Name: string
- Code: string?

### UpdateDirectionRequest

- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?

### UpdateInstituteRequest

- Name: string

### UpdatePeriodRequest

- StartDate: DateTime?
- EndDate: DateTime?
- IsActive: bool?

### UpdateStaffRequest

- Position: string?
- AcademicDegree: string?
- MaxStudentsLoad: int?
- IsSupervisor: bool?
- DepartmentId: int?

### UpdateStaffWorkloadRequest

- MaxStudentsLoad: int

### UpdateStudentRequest

- ProgramId: int?
- GroupCode: string?
- CurrentCourse: int?

### UpdateTopicRequest

- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?
- MaxParticipants: int

### UploadAttachmentRequest

- AttachmentType: AttachmentType
- File: IFormFile

### UploadReviewRequest

- ReviewText: string?
- File: IFormFile?

## Response Schemas

### AcademicProgramResponse

- Id: int
- DepartmentId: int
- DegreeLevelId: int
- Code: string?
- Name: string?
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- IsDeleted: bool
- DeletedAt: DateTime?
- DeletedBy: int?

### AdmittedStudentDto

- WorkId: long
- StudentId: int
- UserId: int

### AssignedReviewerDto

- ReviewId: long
- ReviewerId: int
- FullName: string
- Position: string?
- Organization: string?
- Email: string?
- IsUploaded: bool

### AttachmentResponse

- Id: long
- WorkId: long
- StateId: int?
- AttachmentType: string
- FileName: string
- FileStoragePath: string
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### CommissionDetailDto

- Id: int
- DepartmentId: int
- AcademicYearId: int
- CommissionType: string
- Name: string?
- PreDefenseNumber: int?
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- Members: IReadOnlyCollection<CommissionMemberDto>

### CommissionDto

- Id: int
- DepartmentId: int
- AcademicYearId: int
- CommissionType: string
- Name: string?
- PreDefenseNumber: int?
- MemberCount: int
- CreatedAt: DateTime

### CommissionMemberDto

- Id: int
- CommissionId: int
- UserId: int
- RoleInCommission: string
- CreatedAt: DateTime

### DefenseReadinessDto

- TotalWorks: int
- FullyReady: int
- NotReady: int
- Items: IReadOnlyList\<StudentReadinessItem\>

### StudentReadinessItem

- WorkId: long
- PreDefensePassed: bool
- NormControlPassed: bool
- SoftwareCheckPassed: bool
- AntiPlagiarismPassed: bool
- HasReview: bool
- IsFullyReady: bool

### DefenseSlotResponse

- Id: long
- CommissionId: int
- WorkId: long
- DefenseDate: DateTime
- Location: string?
- AverageScore: decimal?
- Grades: IReadOnlyList<GradeResponse>
- CreatedAt: DateTime

### DegreeLevelResponse

- Id: int
- Name: string
- DurationYears: int
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### DepartmentResponse

- Id: int
- InstituteId: int
- Name: string
- Code: string?
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### DirectionDetailResponse

- Id: long
- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- CurrentStateId: int
- SubmittedAt: DateTime?
- ReviewedAt: DateTime?
- ReviewedBy: int?
- CreatedAt: DateTime
- IsDeleted: bool
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?
- ReviewComment: string?
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- DeletedAt: DateTime?
- DeletedBy: int?
- TopicsCount: int

### DirectionResponse

- Id: long
- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- TitleRu: string
- TitleKz: string?
- TitleEn: string?
- CurrentStateId: int
- SubmittedAt: DateTime?
- ReviewedAt: DateTime?
- ReviewedBy: int?
- CreatedAt: DateTime
- IsDeleted: bool

### EvaluationCriteriaResponse

- Id: int
- WorkTypeId: int
- DepartmentId: int?
- CriteriaName: string
- MaxScore: int
- Weight: decimal

### FailedPreDefenseStudentDto

- WorkId: long
- LastAttemptNumber: int
- LastScore: decimal?
- CanRetake: bool
- LastAttemptDate: DateTime

### GradeResponse

- Id: long
- ScheduleId: long
- MemberId: int
- CriteriaId: int
- Score: int
- Comment: string?
- GradedAt: DateTime

### UserProfileResponse

- UserId: int
- Login: string
- Email: string
- Roles: IReadOnlyList<string>
- DepartmentId: int?
- DepartmentName: string?
- InstituteId: int?
- InstituteName: string?
- CurrentAcademicYearId: int?
- CurrentAcademicYearName: string?
- StaffId: int?
- Position: string?
- AcademicDegree: string?
- IsSupervisor: bool?
- StudentId: int?
- GroupCode: string?

### WorkTypeResponse

- Id: int
- Name: string
- DegreeLevelId: int?

### InstituteResponse

- Id: int
- UniversityId: int
- Name: string
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- Departments: IReadOnlyCollection<DepartmentResponse>?

### LoginResponse

- Token: string
- Login: string
- UserId: int
- Email: string
- Roles: IEnumerable<string>
- RefreshToken: string

### NotificationListResponse

- UnreadCount: int
- Items: IReadOnlyList<NotificationResponse>

### NotificationResponse

- Id: long
- UserId: int
- TemplateId: int?
- Title: string
- Body: string?
- RelatedEntityType: string?
- RelatedEntityId: long?
- IsRead: bool
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### PeriodResponse

- Id: int
- DepartmentId: int
- AcademicYearId: int
- WorkflowStage: string
- StartDate: DateTime
- EndDate: DateTime
- IsActive: bool
- IsCurrentlyOpen: bool

### PreDefenseAttemptDto

- Id: long
- WorkId: long
- PreDefenseNumber: int
- ScheduleId: long?
- AttendanceStatus: string
- AverageScore: decimal?
- IsPassed: bool
- NeedsRetake: bool
- AttemptDate: DateTime
- CreatedAt: DateTime

### PreDefenseScheduleDto

- Id: long
- CommissionId: int
- WorkId: long
- DefenseDate: DateTime
- Location: string?
- AverageScore: decimal?
- GradeCount: int
- CreatedAt: DateTime

### ProtocolResponse

- Id: long
- ScheduleId: long
- CommissionId: int
- SessionDate: DateTime
- DocumentPath: string?
- IsFinalized: bool
- FinalizedBy: int?
- FinalizedAt: DateTime?
- CreatedAt: DateTime

### QualityCheckDto

- Id: long
- WorkId: long
- CheckType: string
- AttemptNumber: int
- IsPassed: bool
- ResultValue: decimal?
- Comment: string?
- DocumentPath: string?
- AssignedExpertId: int?
- CheckedAt: DateTime

### ReviewStatusByDepartmentDto

- TotalWorks: int
- WorksWithReviewer: int
- WorksWithoutReviewer: int
- ReviewsUploaded: int
- ReviewsPending: int
- Items: IReadOnlyList\<WorkReviewStatusItem\>

### WorkReviewStatusItem

- WorkId: long
- ReviewerId: int?
- ReviewerName: string?
- HasReviewer: bool
- IsReviewUploaded: bool

### ScheduleResponse

- Id: long
- CommissionId: int
- WorkId: long
- DefenseDate: DateTime
- Location: string?
- AverageScore: decimal?
- GradeCount: int
- CreatedAt: DateTime

### StaffResponse

- Id: int
- UserId: int
- FullName: string?
- Email: string?
- Position: string?
- AcademicDegree: string?
- DepartmentId: int
- DepartmentName: string?
- MaxStudentsLoad: int

### StudentResponse

- Id: int
- UserId: int
- FullName: string?
- Email: string?
- GroupCode: string?
- ProgramId: int
- ProgramName: string?
- AdmissionYear: int
- CurrentCourse: int
- Status: string

### StudentWorkDetailResponse

- Id: long
- TopicId: long?
- AcademicYearId: int
- DepartmentId: int
- CurrentStateId: int
- IsDefended: bool
- FinalGrade: string?
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- Participants: IReadOnlyList<WorkParticipantResponse>

### SupervisorReviewResponse

- Id: long
- WorkId: long
- SupervisorId: int
- ReviewText: string
- FileStoragePath: string?
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### StudentWorkResponse

- Id: long
- TopicId: long?
- AcademicYearId: int
- DepartmentId: int
- CurrentStateId: int
- IsDefended: bool
- FinalGrade: string?
- CreatedAt: DateTime

### TopicApplicationResponse

- Id: long
- TopicId: long
- StudentId: int
- MotivationLetter: string?
- AppliedAt: DateTime
- Status: string
- IsPending: bool
- IsAccepted: bool
- ReviewedAt: DateTime?
- ReviewedBy: int?
- ReviewComment: string?

### TopicDetailResponse

- Id: long
- DirectionId: long?
- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- TitleRu: string
- TitleEn: string?
- TitleKz: string?
- DescriptionRu: string?
- DescriptionKz: string?
- DescriptionEn: string?
- MaxParticipants: int
- AvailableSpots: int
- IsApproved: bool
- IsClosed: bool
- IsTeamTopic: bool
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?
- Applications: IReadOnlyCollection<TopicApplicationResponse>?

### TopicCoordinationItemResponse

- TopicId: long
- TitleRu: string
- SupervisorId: int
- MaxParticipants: int
- AcceptedCount: int
- PendingCount: int
- AvailableSpots: int
- IsApproved: bool
- IsClosed: bool

### TopicCoordinationSummaryResponse

- TotalTopics: int
- ApprovedTopics: int
- TopicsWithStudents: int
- TopicsWithoutStudents: int
- ClosedTopics: int
- TotalAcceptedApplications: int
- TotalAvailableSpots: int
- Topics: IReadOnlyList\<TopicCoordinationItemResponse\>

### TopicResponse

- Id: long
- DirectionId: long?
- DepartmentId: int
- SupervisorId: int
- AcademicYearId: int
- WorkTypeId: int
- TitleRu: string
- TitleEn: string?
- TitleKz: string?
- MaxParticipants: int
- AvailableSpots: int
- IsApproved: bool
- IsClosed: bool
- IsTeamTopic: bool
- CreatedAt: DateTime

### ReviewResponse

- Id: long
- WorkId: long
- ReviewerId: int
- ReviewText: string?
- FileStoragePath: string?
- IsUploaded: bool
- CreatedAt: DateTime
- CreatedBy: int
- LastModifiedAt: DateTime?
- LastModifiedBy: int?

### WorkParticipantResponse

- Id: long
- StudentId: int
- Role: string
- IsLeader: bool
- JoinedAt: DateTime

### WorkReviewsResponse

- SupervisorReview: SupervisorReviewResponse?
- Reviews: IReadOnlyList<ReviewResponse>
