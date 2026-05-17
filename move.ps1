$ErrorActionPreference = 'Continue'
$dirs = @(
    "packages/shared/src/components/domain/supervisors",
    "packages/shared/src/components/domain/TimePeriods/TimePeriodCard",
    "packages/shared/src/components/domain/TimePeriods/TimePeriodFormDialog",
    "packages/shared/src/components/domain/TimePeriods/SetUp/CommissionScheduleCard",
    "packages/shared/src/components/domain/Directions/DirectionCard",
    "packages/shared/src/components/domain/Directions/DirectionModal",
    "packages/shared/src/components/domain/Directions/DirectionStatusBadge",
    "packages/shared/src/components/domain/Themes/ThemeModal"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Force $d | Out-Null
    }
}

$moves = @(
    @("apps/admin/src/components/supervisors/SupervisorCard.css", "packages/shared/src/components/domain/supervisors/SupervisorCard.css"),
    @("apps/admin/src/components/supervisors/SupervisorSelectionDialog.jsx", "packages/shared/src/components/domain/supervisors/SupervisorSelectionDialog.jsx"),
    @("apps/admin/src/components/supervisors/SupervisorSelectionDialog.css", "packages/shared/src/components/domain/supervisors/SupervisorSelectionDialog.css"),
    @("apps/admin/src/components/supervisors/TeacherSelectionItem.jsx", "packages/shared/src/components/domain/supervisors/TeacherSelectionItem.jsx"),
    @("apps/admin/src/components/supervisors/TeacherSelectionItem.css", "packages/shared/src/components/domain/supervisors/TeacherSelectionItem.css"),
    
    @("apps/admin/src/components/TimePeriods/TimePeriodCard/TimePeriodCard.jsx", "packages/shared/src/components/domain/TimePeriods/TimePeriodCard/TimePeriodCard.jsx"),
    @("apps/admin/src/components/TimePeriods/TimePeriodCard/TimePeriodCard.css", "packages/shared/src/components/domain/TimePeriods/TimePeriodCard/TimePeriodCard.css"),
    @("apps/admin/src/components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.jsx", "packages/shared/src/components/domain/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.jsx"),
    @("apps/admin/src/components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.css", "packages/shared/src/components/domain/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.css"),
    @("apps/admin/src/components/TimePeriods/SetUp/CommissionCard.jsx", "packages/shared/src/components/domain/TimePeriods/SetUp/CommissionCard.jsx"),
    @("apps/admin/src/components/TimePeriods/SetUp/CommissionCard.css", "packages/shared/src/components/domain/TimePeriods/SetUp/CommissionCard.css"),
    @("apps/admin/src/components/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.jsx", "packages/shared/src/components/domain/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.jsx"),
    @("apps/admin/src/components/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.css", "packages/shared/src/components/domain/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.css"),
    @("apps/admin/src/components/TimePeriods/SetUp/MembersModal.jsx", "packages/shared/src/components/domain/TimePeriods/SetUp/MembersModal.jsx"),
    @("apps/admin/src/components/TimePeriods/SetUp/MembersModal.css", "packages/shared/src/components/domain/TimePeriods/SetUp/MembersModal.css"),
    
    @("apps/admin/src/components/Directions/DirectionCard/DirectionCard.jsx", "packages/shared/src/components/domain/Directions/DirectionCard/DirectionCard.jsx"),
    @("apps/admin/src/components/Directions/DirectionCard/DirectionCard.css", "packages/shared/src/components/domain/Directions/DirectionCard/DirectionCard.css"),
    @("apps/admin/src/components/Directions/DirectionModal/DirectionModal.jsx", "packages/shared/src/components/domain/Directions/DirectionModal/DirectionModal.jsx"),
    @("apps/admin/src/components/Directions/DirectionModal/DirectionModal.css", "packages/shared/src/components/domain/Directions/DirectionModal/DirectionModal.css"),
    @("apps/admin/src/components/Directions/DirectionStatusBadge/DirectionStatusBadge.jsx", "packages/shared/src/components/domain/Directions/DirectionStatusBadge/DirectionStatusBadge.jsx"),
    @("apps/admin/src/components/Directions/DirectionStatusBadge/DirectionStatusBadge.css", "packages/shared/src/components/domain/Directions/DirectionStatusBadge/DirectionStatusBadge.css"),
    
    @("apps/admin/src/components/Themes/ThemeModal/ThemeModal.jsx", "packages/shared/src/components/domain/Themes/ThemeModal/ThemeModal.jsx"),
    @("apps/admin/src/components/Themes/ThemeModal/ThemeModal.css", "packages/shared/src/components/domain/Themes/ThemeModal/ThemeModal.css")
)

foreach ($m in $moves) {
    if (Test-Path $m[0]) {
        git mv $m[0] $m[1]
        Write-Host "Moved $($m[0])"
    } else {
        Write-Host "Skip $($m[0])"
    }
}

$rms = @(
    "apps/department/src/components/supervisors/SupervisorCard.jsx",
    "apps/department/src/components/supervisors/SupervisorCard.css",
    "apps/department/src/components/supervisors/SupervisorSelectionDialog.jsx",
    "apps/department/src/components/supervisors/SupervisorSelectionDialog.css",
    "apps/department/src/components/supervisors/TeacherSelectionItem.jsx",
    "apps/department/src/components/supervisors/TeacherSelectionItem.css",
    
    "apps/department/src/components/TimePeriods/TimePeriodCard/TimePeriodCard.jsx",
    "apps/department/src/components/TimePeriods/TimePeriodCard/TimePeriodCard.css",
    "apps/department/src/components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.jsx",
    "apps/department/src/components/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog.css",
    "apps/department/src/components/TimePeriods/SetUp/CommissionCard.jsx",
    "apps/department/src/components/TimePeriods/SetUp/CommissionCard.css",
    "apps/department/src/components/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.jsx",
    "apps/department/src/components/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard.css",
    "apps/department/src/components/TimePeriods/SetUp/MembersModal.jsx",
    "apps/department/src/components/TimePeriods/SetUp/MembersModal.css",
    
    "apps/department/src/components/Directions/DirectionCard/DirectionCard.jsx",
    "apps/department/src/components/Directions/DirectionCard/DirectionCard.css",
    "apps/department/src/components/Directions/DirectionModal/DirectionModal.jsx",
    "apps/department/src/components/Directions/DirectionModal/DirectionModal.css",
    "apps/department/src/components/Directions/DirectionStatusBadge/DirectionStatusBadge.jsx",
    "apps/department/src/components/Directions/DirectionStatusBadge/DirectionStatusBadge.css",
    
    "apps/department/src/components/Themes/ThemeModal/ThemeModal.jsx",
    "apps/department/src/components/Themes/ThemeModal/ThemeModal.css"
)

foreach ($r in $rms) {
    if (Test-Path $r) {
        git rm -f $r
        Write-Host "Removed $r"
    } else {
        Write-Host "Skip $r"
    }
}
