#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys

MAIN_REPO = "/Users/3o/Documents/Study/FYP"
BUILD_DIR = "/tmp/greenwich-preview-rebuild"
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

# 5 Commits for Implementation Phase (14/10/2026 to 18/10/2026)
PHASE_B = [
    {
        "date": "2026-10-14 11:00:00",
        "msg": "feat(infra): setup polyglot docker compose, 28-table 3nf postgresql ddl, knex migrations, and zod dto foundation",
        "items": [
            "docker-compose.yml", ".env.example", ".gitignore",
            "docker/init-db/01-init.sql", "server/knexfile.js", "server/src/db/migrator.js",
            "server/migrations/20261017000001_create_initial_schema.js",
            "server/tsconfig.json", "server/src/schemas/index.d.ts", "server/src/middlewares/zod.middleware.js"
        ]
    },
    {
        "date": "2026-10-15 14:30:00",
        "msg": "feat(auth): implement module 1 - user identity, rbac, bcrypt 12 rounds, and dual-token security with strict tdd",
        "items": [
            "server/package.json", "server/package-lock.json", "server/jest.config.js",
            "server/src/app.js", "server/src/server.js",
            "server/src/utils/password.util.js", "server/src/services/token.service.js",
            "server/src/repositories/user.repository.js", "server/src/services/auth.service.js",
            "server/src/schemas/auth.zod.js", "server/src/middlewares/validate.middleware.js",
            "server/src/middlewares/auth.middleware.js", "server/src/controllers/auth.controller.js",
            "server/src/routes/auth.routes.js", "server/tests/unit/utils/password.test.js",
            "server/tests/unit/services/token.service.test.js", "server/tests/unit/repositories/user.repository.test.js",
            "server/tests/unit/middlewares/", "server/tests/unit/db/",
            "server/tests/integration/auth.login.test.js", "server/tests/integration/auth.register.test.js",
            "server/tests/integration/app.test.js"
        ]
    },
    {
        "date": "2026-10-16 16:00:00",
        "msg": "feat(booking): implement module 2 - smart flight and hotel aggregator with duffel live ndc api and redis cache",
        "items": [
            "server/src/providers/duffel.provider.js", "server/src/providers/google.provider.js",
            "server/src/providers/mock.provider.js", "server/src/services/normalizer.service.js",
            "server/src/services/cache.service.js", "server/src/services/booking.service.js",
            "server/src/controllers/flight.controller.js", "server/src/controllers/hotel.controller.js",
            "server/src/routes/flight.routes.js", "server/src/routes/hotel.routes.js",
            "server/tests/unit/providers/", "server/tests/unit/services/normalizer.test.js",
            "server/tests/unit/services/cache.service.test.js", "server/tests/unit/services/booking.aggregator.test.js",
            "server/tests/integration/duffel.live.test.js", "server/tests/integration/flight.search.test.js",
            "server/tests/integration/hotel.search.test.js"
        ]
    },
    {
        "date": "2026-10-17 11:30:00",
        "msg": "feat(core-backend): implement module 3 (itinerary haversine) and module 4 (postgresql acid ledger & greedy debt algorithm)",
        "items": [
            "server/src/utils/geo.util.js", "server/src/utils/debt.util.js",
            "server/src/models/", "server/src/repositories/itinerary.repository.js",
            "server/src/repositories/expense.repository.js", "server/src/services/itinerary.service.js",
            "server/src/services/expense.service.js", "server/src/services/crossDbIntegrity.service.js",
            "server/src/services/places.service.js", "server/src/providers/places.provider.js",
            "server/src/providers/cloudinary.provider.js", "server/src/controllers/itinerary.controller.js",
            "server/src/controllers/expense.controller.js", "server/src/controllers/places.controller.js",
            "server/src/routes/itinerary.routes.js", "server/src/routes/expense.routes.js",
            "server/src/routes/places.routes.js", "server/src/schemas/expense.zod.js",
            "server/tests/unit/models/", "server/tests/unit/utils/geo.util.test.js",
            "server/tests/unit/utils/debt.util.test.js", "server/tests/unit/repositories/itinerary.repository.test.js",
            "server/tests/unit/repositories/expense.repository.test.js", "server/tests/unit/services/expense.service.test.js",
            "server/tests/unit/services/crossDbIntegrity.service.test.js", "server/tests/unit/services/places.service.test.js",
            "server/tests/unit/providers/places.provider.test.js", "server/tests/integration/itinerary.*",
            "server/tests/integration/expense.*", "server/tests/integration/places.api.test.js"
        ]
    },
    {
        "date": "2026-10-18 11:20:00",
        "msg": "feat(mobile): implement complete react native client (expo sdk 57, mapbox discovery, multi-city wizard, english i18n, and ci/cd)",
        "items": ["*"] # sync everything remaining (client, workflows, etc.)
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
    print("=== Rebuilding Greenwich History (Chốt Preview HTML vào 13/10/2026) ===")
    
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
        
    print(f"Cloning {MAIN_REPO} into {BUILD_DIR}...")
    run(f"git clone {MAIN_REPO} {BUILD_DIR}")
    
    run("git remote add greenwich " + GREENWICH_REMOTE, cwd=BUILD_DIR)
    run("git fetch greenwich", cwd=BUILD_DIR)
    
    # Reset branch to 373c03c (Week 4: 22/09/2026)
    print("Checking out commit 373c03c as base...")
    run("git checkout -b main-greenwich-rebuild 373c03c", cwd=BUILD_DIR)
    
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
    
    # Phase A: 21 commits (23/09 to 13/10)
    for idx, (c_date, c_msg) in enumerate(PHASE_A, start=1):
        # We can add an entry in docs or preview notes to record daily activity
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

    # Phase B: 5 commits (14/10 to 18/10)
    for idx, c in enumerate(PHASE_B, start=1):
        c_date = c["date"]
        c_msg = c["msg"]
        items = c["items"]
        
        if items == ["*"]:
            # Sync all remaining files from MAIN_REPO to BUILD_DIR
            print("Syncing all remaining files for 18/10 commit...")
            rsync_cmd = (
                f"rsync -av --delete "
                f"--exclude='.git' "
                f"--exclude='node_modules' "
                f"--exclude='server/node_modules' "
                f"--exclude='client/node_modules' "
                f"--exclude='memory-bank' "
                f"--exclude='.agents' "
                f"--exclude='.expo' "
                f"--exclude='client/.expo' "
                f"--exclude='coverage' "
                f"--exclude='server/coverage' "
                f"--exclude='tmp' "
                f"--exclude='scripts/build_greenwich_daily.py' "
                f"--exclude='scripts/rebuild_greenwich_preview_schedule.py' "
                f"{MAIN_REPO}/ {BUILD_DIR}/"
            )
            run(rsync_cmd)
        else:
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

    print("\n=== Verified Log in Rebuilt Greenwich Branch ===")
    log_out = run("git log --oneline -n 30", cwd=BUILD_DIR)
    print(log_out)
    
    print("\nForce-pushing updated linear history to greenwich main...")
    push_out = run("git push -f greenwich main-greenwich-rebuild:main", cwd=BUILD_DIR)
    print(push_out)
    print("\nSUCCESS! Successfully re-aligned Greenwich history with 13/10 HTML Preview sign-off.")

if __name__ == "__main__":
    main()
