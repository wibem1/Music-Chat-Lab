# Cleanup policy

Temporary patch modules may remain only while referenced by the active runtime. Once their behavior is consolidated into the current modules and references are removed, they should be deleted from `main` rather than kept as historical clutter.
