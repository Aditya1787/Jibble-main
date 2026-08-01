# ================================================================
#  repoint_and_push.ps1
#  Run this AFTER creating a new empty repo on GitHub.
#  Replace NEW_REPO_URL below with your new repo's HTTPS URL.
# ================================================================

$NEW_REPO_URL = "https://github.com/Aditya1787/Jibble.git"   # <-- change if needed

Set-Location "d:\for opening\for opening\Jibble"

Write-Host "Adding new remote 'fresh' -> $NEW_REPO_URL"
git remote add fresh $NEW_REPO_URL 2>&1

Write-Host "Pushing all history to new repo (this may take a minute)..."
git push fresh main --force

Write-Host ""
Write-Host "Done! Your contribution graph should update within a few minutes."
Write-Host "You can now set it as your main origin if you want:"
Write-Host "  git remote remove origin"
Write-Host "  git remote rename fresh origin"
