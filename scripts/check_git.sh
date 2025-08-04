#!/bin/sh

# Check if gum is installed
command -v gum >/dev/null 2>&1 || { echo "Gum is not installed. Do you need to run 'brew install gum'?"; exit 1; }

# Check if git is installed
if ! command -v git >/dev/null 2>&1; then
  gum style --foreground 196 "Git is not installed"
  exit 1
fi

# Check if current directory is a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  gum style --foreground 196 "Not a git repository"
  exit 1
fi

# Get current branch name
current_branch=$(git branch --show-current)

# Check if on main branch
if [ "$current_branch" != "main" ]; then
  gum style --foreground 196 "Must be on main branch. Current branch is: $current_branch"
  exit 1
fi

# Check if there are any changes
# if [ -n "$(git status --porcelain)" ]; then
#   gum style --foreground 196 "There are uncommitted changes. Please commit or stash them."
#   exit 1
# fi

# Print success message
gum style --foreground 46 "Current branch is main and there are no uncommitted changes"

# Pull origin/main
gum confirm "Running git pull origin main" && git pull origin main

