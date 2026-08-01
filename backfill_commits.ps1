# =============================================================
#  backfill_commits.ps1
#  Fills the GitHub contribution graph for the last 365 days.
#  Each day gets 2-5 backdated commits on a dedicated log file.
#  Run from the repo root. Push with: git push origin main
# =============================================================

$ErrorActionPreference = "Stop"

# ── Config ────────────────────────────────────────────────────
$REPO_ROOT   = Split-Path -Parent $MyInvocation.MyCommand.Path
$LOG_FILE    = Join-Path $REPO_ROOT "logs\activity.md"
$BRANCH      = "main"          # change if your default branch differs
$PUSH        = $true           # set to $false to do a dry-run without pushing
$MIN_COMMITS = 2
$MAX_COMMITS = 5
# ─────────────────────────────────────────────────────────────

Set-Location $REPO_ROOT

# Ensure logs/ directory exists and is tracked
$logsDir = Join-Path $REPO_ROOT "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}
if (-not (Test-Path $LOG_FILE)) {
    "# Jibble activity log" | Out-File -FilePath $LOG_FILE -Encoding utf8
    git add $LOG_FILE 2>&1 | Out-Null
    git commit -m "chore: init activity log" 2>&1 | Out-Null
}

# logs/activity.md uses .md extension to avoid the *.log gitignore rule

# ── Date range: today going back 365 days ────────────────────
$today     = (Get-Date).Date
$startDate = $today.AddDays(-365)

Write-Host "Repo  : $REPO_ROOT"
Write-Host "Branch: $BRANCH"
Write-Host "Range : $($startDate.ToString('yyyy-MM-dd'))  ->  $($today.ToString('yyyy-MM-dd'))"
Write-Host "Push  : $PUSH"
Write-Host ""

$messages = @(
    "chore: update activity log",
    "chore: daily progress checkpoint",
    "docs: update development notes",
    "chore: housekeeping",
    "chore: sync workspace state",
    "refactor: minor cleanup",
    "docs: add daily notes",
    "chore: routine maintenance",
    "fix: minor adjustments",
    "chore: log daily activity"
)

$totalCommits = 0

for ($d = $startDate; $d -le $today; $d = $d.AddDays(1)) {

    $numCommits = Get-Random -Minimum $MIN_COMMITS -Maximum ($MAX_COMMITS + 1)

    for ($c = 1; $c -le $numCommits; $c++) {

        # Spread commits through the day (8 AM - 11 PM)
        $hour   = Get-Random -Minimum 8  -Maximum 23
        $minute = Get-Random -Minimum 0  -Maximum 59
        $second = Get-Random -Minimum 0  -Maximum 59

        $commitDT  = $d.AddHours($hour).AddMinutes($minute).AddSeconds($second)
        $gitDate   = $commitDT.ToString("ddd MMM dd HH:mm:ss yyyy") + " +0530"

        # Append a line to the log file (makes the tree dirty)
        $logLine = "[{0}] commit {1}/{2} - automated activity" -f $commitDT.ToString("yyyy-MM-dd HH:mm:ss"), $c, $numCommits
        Add-Content -Path $LOG_FILE -Value $logLine -Encoding utf8

        # Stage the file
        git add $LOG_FILE 2>&1 | Out-Null

        # Pick a commit message
        $msg = $messages[(Get-Random -Minimum 0 -Maximum $messages.Count)]

        # Commit with backdated author & committer dates
        $env:GIT_AUTHOR_DATE    = $gitDate
        $env:GIT_COMMITTER_DATE = $gitDate

        git commit -m $msg 2>&1 | Out-Null

        $totalCommits++
    }

    Write-Host ("  {0}  ->  {1} commits" -f $d.ToString("yyyy-MM-dd"), $numCommits)
}

# Restore env vars
Remove-Item Env:\GIT_AUTHOR_DATE    -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Done! $totalCommits backdated commits created."

if ($PUSH) {
    Write-Host "Pushing to origin/$BRANCH ..."
    git push origin $BRANCH
    Write-Host "Push complete. Check your GitHub profile in ~1 minute."
} else {
    Write-Host "Dry-run mode - skipping push."
    Write-Host "Run  git push origin $BRANCH  when ready."
}
