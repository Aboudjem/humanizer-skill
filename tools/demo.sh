#!/usr/bin/env bash
# demo.sh - terminal-recorded humanizer demo
# Used by tools/demo.tape (vhs) to render .github/assets/demo.gif

set -e

BOLD=$'\033[1m'
DIM=$'\033[2m'
RED=$'\033[31m'
GREEN=$'\033[32m'
YELLOW=$'\033[33m'
BLUE=$'\033[34m'
VIOLET=$'\033[38;5;141m'
RESET=$'\033[0m'

clear
printf "${VIOLET}${BOLD}humanizer${RESET}  ${DIM}Make AI text sound human${RESET}\n"
printf "${DIM}43 patterns, 5 voices, one Markdown file, zero API calls${RESET}\n\n"
sleep 1.0

printf "${BOLD}\$${RESET} /humanizer --mode detect --score \"This comprehensive guide delves\n  into the intricacies of authentication.\"\n\n"
sleep 1.5

printf "${YELLOW}Scanning for 43 AI patterns...${RESET}\n"
sleep 0.6
printf "${DIM}  P4  Promotional Language    \"comprehensive\"${RESET}\n"
sleep 0.25
printf "${DIM}  P7  AI Vocabulary           \"delves into\"${RESET}\n"
sleep 0.25
printf "${DIM}  P7  AI Vocabulary           \"intricacies\"${RESET}\n"
sleep 0.25
printf "${DIM}  P18 Formal Register         opening clause${RESET}\n"
sleep 0.25
printf "${DIM}  P29 Comprehensive Overview  \"This comprehensive guide\"${RESET}\n"
sleep 0.4
printf "\n${RED}${BOLD}[Score: 84/100, Pure AI smell]${RESET}\n"
sleep 1.5

printf "\n${BOLD}\$${RESET} /humanizer --voice technical --aggressive --iterate 2\n\n"
sleep 1.0

printf "${BLUE}Iteration 1: detect (5 patterns), rewrite, re-detect (1 pattern)${RESET}\n"
sleep 0.6
printf "${BLUE}Iteration 2: detect (1 pattern), rewrite, re-detect (0)${RESET}\n"
sleep 0.6
printf "${GREEN}Converged.${RESET}\n\n"
sleep 0.6

printf "${BOLD}Rewrite:${RESET}\n\n"
sleep 0.4
printf "  The auth system uses JWTs. Tokens expire after\n"
sleep 0.3
printf "  15 minutes. Refresh tokens last 7 days. The rotation\n"
sleep 0.3
printf "  logic is in src/auth/refresh.ts.\n\n"
sleep 0.6

printf "${GREEN}${BOLD}[Score: 8/100, Pristine]${RESET}\n"
sleep 0.6
printf "${DIM}Sentence lengths: 6, 5, 6, 9 words. Burstiness: +0.71.${RESET}\n"
sleep 2.0
