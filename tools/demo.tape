# vhs script for humanizer demo
# Run: vhs tools/demo.tape (output: .github/assets/demo.gif)
#
# tools/demo.sh is the script being recorded.

Output .github/assets/demo.gif

Set FontSize 16
Set Width 880
Set Height 560
Set Padding 30
Set Theme "Dracula"
Set Shell "bash"
Set TypingSpeed 0ms
Set PlaybackSpeed 1.0

Hide
Type "clear" Enter
Type "bash tools/demo.sh" Sleep 200ms
Show
Enter

Sleep 14s
