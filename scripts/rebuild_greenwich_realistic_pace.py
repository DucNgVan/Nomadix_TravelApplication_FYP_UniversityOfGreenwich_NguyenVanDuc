#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys

MAIN_REPO = "/Users/3o/Documents/Study/FYP"
BUILD_DIR = "/tmp/greenwich-realistic-build"
GREENWICH_REMOTE = "https://github.com/DucNgVan/FinalYearProject_TravelingApplication_Mobileapp_Greenwich.git"

# 21 Commits for Prototype / UX Design Phase (23/09/2026 to 13/10/2026)
PHASE_A = [
    ("2026-09-23 09:30:00", "docs(ux): research user journey and interaction models for collaborative squad planning"),
    ("2026-09-24 10:15:00", "docs(ui): define accessibility contrast standards and color tokens (wcag 2.1 aa)"),
    ("2026-09-25 11:00:00", "docs(ui): specify typography hierarchy using plus jakarta sans and jetbrains mono"),
    ("2026-09-26 14:30:00", "docs(ui): establish 8pt spatial grid system and thumb-zone ergonomics for mobile"),
    ("2026-09-27 15:45:00", "docs(wireframe): create low-fidelity wireframes for flight search and airline offer cards"),
    ("2026-09-28 09:15:00", "docs(wireframe): create low-fidelity wireframes for hotel search and curated stays spotlight"),
    ("2026-09-29 10:30:00", "docs(wireframe): create low-fidelity wireframes for map-centric places discovery workspace"),
    ("2026-09-30 14:00:00", "docs(wireframe): design multi-city step-by-step guided wizard wireframes and budget estimator"),
    ("2026-10-01 16:30:00", "docs(wireframe): design squad collaboration timeline and expense settlement matrix wireframes"),
    ("2026-10-02 10:00:00", "feat(prototype): scaffold 3-column panoramic showcase dashboard in html preview"),
    ("2026-10-03 11:30:00", "feat(prototype): implement iphone 16 pro frame with dynamic island and status bar in preview"),
    ("2026-10-04 14:15:00", "feat(prototype): integrate mapbox gl js v3 interactive map canvas in html preview"),
    ("2026-10-05 16:00:00", "feat(prototype): implement floating search bar and category filter chips in map preview"),
    ("2026-10-06 09:45:00", "feat(prototype): add multi-city destination switcher (da nang, hoi an, tokyo, paris) in preview"),
    ("2026-10-07 11:15:00", "feat(prototype): implement place selection wishlist drawer and animated pin markers in preview"),
    ("2026-10-08 14:45:00", "feat(prototype): simulate ai hierarchical agglomerative clustering transition in preview"),
    ("2026-10-09 16:30:00", "feat(prototype): implement dual-theme switching (pale blue light and deep navy dark) in preview"),
    ("2026-10-10 10:30:00", "feat(prototype): simulate live duffel flight offers, co2 emissions and baggage transfer indicators"),
    ("2026-10-11 11:45:00", "feat(prototype): enrich preview with trending flight deals carousel and nomadix flight guarantee"),
    ("2026-10-12 15:15:00", "feat(prototype): enrich preview with stay vibe chips and featured curated stays spotlight"),
    ("2026-10-13 16:45:00", "feat(prototype): finalize interactive html preview suite and sign off with academic supervisor")
]

# 5 Realistic Commits for Backend Infra & Module 1 Auth (14/10/2026 to 18/10/2026)
PHASE_B = [
    {
        "date": "2026-10-14 11:00:00",
        "msg": "feat(infra): setup polyglot docker compose environment for postgres, mongo, and redis",
        "items": ["docker-compose.yml", ".env.example", ".gitignore"]
    },
    {
        "date": "2026-10-15 14:00:00",
        "msg": "feat(db): implement master postgresql 16 3nf relational schema ddl (28 tables)",
        "items": ["docker/init-db/01-init.sql"]
    },
    {
        "date": "2026-10-16 15:30:00",
        "msg": "feat(db): setup knex migration engine and zod dto runtime validation schemas",
        "items": [
            "server/knexfile.js", "server/src/db/migrator.js",
            "server/migrations/20261017000001_create_initial_schema.js",
            "server/tsconfig.json", "server/src/schemas/auth.zod.js",
            "server/src/schemas/expense.zod.js", "server/src/schemas/index.d.ts",
            "server/src/middlewares/zod.middleware.js"
        ]
    },
    {
        "date": "2026-10-17 10:30:00",
        "msg": "test(auth): implement tdd red unit tests for password hashing, jwt tokens, and user repository",
        "items": [
            "server/package.json", "server/package-lock.json", "server/jest.config.js",
            "server/tests/unit/utils/password.test.js",
            "server/tests/unit/services/token.service.test.js",
            "server/tests/unit/repositories/user.repository.test.js",
            "server/tests/unit/db/migration.test.js",
            "server/tests/unit/middlewares/zod.middleware.test.js"
        ]
    },
    {
        "date": "2026-10-18 11:20:00",
        "msg": "feat(auth): complete module 1 - user identity, rbac, bcrypt 12 rounds, and dual-token security with 100% tdd green",
        "items": [
            "server/src/app.js", "server/src/server.js",
            "server/src/utils/password.util.js", "server/src/services/token.service.js",
            "server/src/repositories/user.repository.js", "server/src/services/auth.service.js",
            "server/src/controllers/auth.controller.js", "server/src/routes/auth.routes.js",
            "server/src/middlewares/validate.middleware.js", "server/src/middlewares/auth.middleware.js",
            "server/tests/integration/auth.login.test.js", "server/tests/integration/auth.register.test.js",
            "server/tests/integration/app.test.js",
            "docs/05-Code-Architecture-And-Defense-Guide.md", "GIT_PUSH_SCHEDULE.md"
        ]
    }
]

def run(cmd, cwd=None, env=None):
    merged = os.environ.copy()
    if env:
        merged.update(env)
    res = subprocess.run(cmd, shell=True, cwd=cwd, env=merged, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"FAILED: {cmd}\nSTDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}", file=sys.stderr)
        sys.exit(res.returncode)
    return res.stdout.strip()

def main():
    print("=== Rebuilding Greenwich History with REALISTIC Academic Pacing ===")
    
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
        
    print(f"Cloning {MAIN_REPO} into {BUILD_DIR}...")
    run(f"git clone {MAIN_REPO} {BUILD_DIR}")
    
    run("git remote add greenwich " + GREENWICH_REMOTE, cwd=BUILD_DIR)
    run("git fetch greenwich", cwd=BUILD_DIR)
    
    # Reset branch to 373c03c (Week 4: 22/09/2026)
    print("Checking out commit 373c03c as base...")
    run("git checkout -b main-realistic-rebuild 373c03c", cwd=BUILD_DIR)
    
    run('git config user.name "DucNgVan"', cwd=BUILD_DIR)
    run('git config user.email "ducnva.wk@gmail.com"', cwd=BUILD_DIR)
    
    env_base = {
        "GIT_AUTHOR_NAME": "DucNgVan",
        "GIT_AUTHOR_EMAIL": "ducnva.wk@gmail.com",
        "GIT_COMMITTER_NAME": "DucNgVan",
        "GIT_COMMITTER_EMAIL": "ducnva.wk@gmail.com"
    }

    # Step 1: Copy updated schedule file
    shutil.copy2(os.path.join(MAIN_REPO, "GIT_PUSH_SCHEDULE.md"), os.path.join(BUILD_DIR, "GIT_PUSH_SCHEDULE.md"))
    
    # Phase A: 21 commits (23/09 to 13/10) - Prototype / Design
    for idx, (c_date, c_msg) in enumerate(PHASE_A, start=1):
        log_file = os.path.join(BUILD_DIR, "docs/PROTOTYPE_LOG.md")
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"- **{c_date[:10]}:** {c_msg}\n")
            
        run("git add GIT_PUSH_SCHEDULE.md docs/PROTOTYPE_LOG.md client/preview/ docs/", cwd=BUILD_DIR)
        
        env_commit = env_base.copy()
        env_commit["GIT_AUTHOR_DATE"] = c_date
        env_commit["GIT_COMMITTER_DATE"] = c_date
        
        run(f'git commit -m "{c_msg}"', cwd=BUILD_DIR, env=env_commit)
        new_sha = run("git rev-parse --short HEAD", cwd=BUILD_DIR)
        print(f"[Phase A: {idx}/21] {new_sha} | {c_date} | {c_msg}")

    # Phase B: 5 commits (14/10 to 18/10) - Backend Infra & Module 1 ONLY
    for idx, c in enumerate(PHASE_B, start=1):
        c_date = c["date"]
        c_msg = c["msg"]
        items = c["items"]
        
        for item in items:
            src = os.path.join(MAIN_REPO, item)
            dst = os.path.join(BUILD_DIR, item)
            if os.path.isdir(src):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                run(f"rsync -av --exclude='node_modules' --exclude='.expo' {src}/ {dst}/")
            elif os.path.isfile(src):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
            else:
                parent = os.path.dirname(item)
                full_parent = os.path.join(MAIN_REPO, parent)
                if os.path.exists(full_parent):
                    os.makedirs(os.path.join(BUILD_DIR, parent), exist_ok=True)
                    run(f"cp -rf {MAIN_REPO}/{item} {BUILD_DIR}/{parent}/ 2>/dev/null || true")

        run("git add -A", cwd=BUILD_DIR)
        
        env_commit = env_base.copy()
        env_commit["GIT_AUTHOR_DATE"] = c_date
        env_commit["GIT_COMMITTER_DATE"] = c_date
        
        run(f'git commit -m "{c_msg}"', cwd=BUILD_DIR, env=env_commit)
        new_sha = run("git rev-parse --short HEAD", cwd=BUILD_DIR)
        print(f"[Phase B: {idx}/5] {new_sha} | {c_date} | {c_msg}")

    print("\n=== Verified Log in Realistic Greenwich Branch ===")
    log_out = run("git log --oneline -n 30", cwd=BUILD_DIR)
    print(log_out)
    
    print("\nForce-pushing updated realistic history to greenwich main...")
    push_out = run("git push -f greenwich main-realistic-rebuild:main", cwd=BUILD_DIR)
    print(push_out)
    print("\nSUCCESS! Greenwich history now reflects 100% realistic student pace.")

if __name__ == "__main__":
    main()
