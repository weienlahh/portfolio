# Linux Log Analysis Toolkit

**Technologies:** Bash, Linux, AWK, Git

## Overview

Developed a Bash command-line toolkit for recursively analysing Linux-style system logs and generating repeatable summaries for support and development workflows.

## Key Features

- Recursively discovers `.log` files across directory trees.
- Aggregates ERROR, WARN, and INFO log entries.
- Counts log activity by service.
- Identifies failed-login events by username.
- Ranks the most frequently occurring users.
- Generates consolidated plain-text reports.
- Handles invalid commands, arguments, paths, and output locations.
- Uses deterministic sorting for consistent results.

## Testing

Created an automated shell test suite covering:

- expected command behaviour;
- exact output validation;
- invalid arguments;
- missing directories;
- exit statuses;
- sorting behaviour;
- report generation;
- edge cases.

## Technical Approach

Used standard Unix utilities including:

- `find`
- `awk`
- `sort`
- `head`
- `dirname`

The toolkit was structured using reusable Bash functions for individual commands and reporting logic.

## Skills Demonstrated

Bash, Linux, AWK, Shell Scripting, CLI Design, Automated Testing, Error Handling, Git

## Portfolio Note

The complete university assessment solution is not published publicly.