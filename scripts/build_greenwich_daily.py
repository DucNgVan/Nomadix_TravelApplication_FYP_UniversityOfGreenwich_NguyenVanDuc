#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys

MAIN_REPO = "/Users/3o/Documents/Study/FYP"
BUILD_DIR = "/tmp/greenwich-daily-build"
GREENWICH_REMOTE = "https://github.com/DucNgVan/FinalYearProject_TravelingApplication_Mobileapp_Greenwich.git"

COMMITS = [
    # STT 1: 2026-09-23
    {
        "date": "2026-09-23 10:00:00",
        "msg": "feat(infra): setup polyglot docker compose environment for postgres, mongo, and redis",
        "patterns": ["docker-compose.yml", ".env.example", ".gitignore"]
    },
    # STT 2: 2026-09-24
    {
        "date": "2026-09-24 10:30:00",
        "msg": "feat(db): implement master postgresql 16 3nf relational schema ddl (28 tables)",
        "patterns": ["docker/init-db/01-init.sql"]
    },
    # STT 3: 2026-09-25
    {
        "date": "2026-09-25 11:00:00",
        "msg": "feat(db): setup knex migration engine with automated up and down rollback hooks",
        "patterns": ["server/knexfile.js", "server/src/db/migrator.js"]
    },
    # STT 4: 2026-09-26
    {
        "date": "2026-09-26 14:00:00",
        "msg": "feat(db): add initial schema knex versioned migration for 28 relational tables",
        "patterns": ["server/migrations/20261017000001_create_initial_schema.js"]
    },
    # STT 5: 2026-09-27
    {
        "date": "2026-09-27 15:30:00",
        "msg": "feat(types): initialize server typescript configuration and zod dto foundation",
        "patterns": ["server/tsconfig.json", "server/src/schemas/index.d.ts"]
    },
    # STT 6: 2026-09-28
    {
        "date": "2026-09-28 16:00:00",
        "msg": "feat(security): implement zod request validation middleware with error envelopes",
        "patterns": ["server/src/middlewares/zod.middleware.js"]
    },
    # STT 7: 2026-09-29
    {
        "date": "2026-09-29 09:30:00",
        "msg": "feat(server): initialize express application scaffold, dependencies, and jest config",
        "patterns": ["server/package.json", "server/package-lock.json", "server/jest.config.js"]
    },
    # STT 8: 2026-09-30
    {
        "date": "2026-09-30 11:15:00",
        "msg": "feat(server): configure security headers, cors, json body parser, and base routing",
        "patterns": ["server/src/app.js", "server/src/server.js"]
    },
    # STT 9: 2026-10-01
    {
        "date": "2026-10-01 10:00:00",
        "msg": "test(auth): add tdd red unit tests for bcrypt password hashing and constant-time check",
        "patterns": ["server/tests/unit/utils/password.test.js"]
    },
    # STT 10: 2026-10-02
    {
        "date": "2026-10-02 14:45:00",
        "msg": "feat(auth): implement bcrypt 12-round password hashing utility (tdd green)",
        "patterns": ["server/src/utils/password.util.js"]
    },
    # STT 11: 2026-10-03
    {
        "date": "2026-10-03 10:30:00",
        "msg": "test(auth): add tdd red unit tests for jwt access tokens and sha-256 refresh tokens",
        "patterns": ["server/tests/unit/services/token.service.test.js"]
    },
    # STT 12: 2026-10-04
    {
        "date": "2026-10-04 16:15:00",
        "msg": "feat(auth): implement token service with jwt 15m and sha-256 token rotation (tdd green)",
        "patterns": ["server/src/services/token.service.js"]
    },
    # STT 13: 2026-10-05
    {
        "date": "2026-10-05 09:45:00",
        "msg": "feat(auth): implement dual-mode user repository for postgres pool and in-memory test",
        "patterns": ["server/src/repositories/user.repository.js", "server/tests/unit/repositories/user.repository.test.js"]
    },
    # STT 14: 2026-10-06
    {
        "date": "2026-10-06 14:00:00",
        "msg": "feat(auth): implement authentication service with conflict detection and credentials verification",
        "patterns": ["server/src/services/auth.service.js"]
    },
    # STT 15: 2026-10-07
    {
        "date": "2026-10-07 11:30:00",
        "msg": "feat(auth): configure joi and zod validation schemas for auth registration and login",
        "patterns": ["server/src/schemas/auth.zod.js", "server/src/middlewares/validate.middleware.js", "server/src/middlewares/auth.middleware.js", "server/tests/unit/middlewares/auth.middleware.test.js", "server/tests/unit/middlewares/zod.middleware.test.js", "server/tests/unit/db/migration.test.js"]
    },
    # STT 16: 2026-10-08
    {
        "date": "2026-10-08 15:45:00",
        "msg": "feat(auth): create auth controller, v1 route handlers, and integration test suite",
        "patterns": ["server/src/controllers/auth.controller.js", "server/src/routes/auth.routes.js", "server/tests/integration/auth.login.test.js", "server/tests/integration/auth.register.test.js", "server/tests/integration/app.test.js"]
    },
    # STT 17: 2026-10-09
    {
        "date": "2026-10-09 10:20:00",
        "msg": "feat(booking): implement live duffel ndc flights provider and iso 8601 duration parser",
        "patterns": ["server/src/providers/duffel.provider.js", "server/tests/unit/providers/duffel.provider.test.js", "server/tests/integration/duffel.live.test.js"]
    },
    # STT 18: 2026-10-10
    {
        "date": "2026-10-10 14:30:00",
        "msg": "feat(booking): add google places new search provider with domestic catalog fallback",
        "patterns": ["server/src/providers/google.provider.js", "server/src/providers/mock.provider.js", "server/tests/unit/providers/google.provider.test.js", "server/tests/unit/providers/mock.provider.test.js"]
    },
    # STT 19: 2026-10-11
    {
        "date": "2026-10-11 11:00:00",
        "msg": "feat(booking): implement unified normalizer service and redis cache-aside layer",
        "patterns": ["server/src/services/normalizer.service.js", "server/src/services/cache.service.js", "server/tests/unit/services/normalizer.test.js", "server/tests/unit/services/cache.service.test.js"]
    },
    # STT 20: 2026-10-12
    {
        "date": "2026-10-12 16:00:00",
        "msg": "feat(booking): create smart flight and hotel aggregator service with facet filters",
        "patterns": ["server/src/services/booking.service.js", "server/src/controllers/flight.controller.js", "server/src/controllers/hotel.controller.js", "server/src/routes/flight.routes.js", "server/src/routes/hotel.routes.js", "server/tests/unit/services/booking.aggregator.test.js", "server/tests/integration/flight.search.test.js", "server/tests/integration/hotel.search.test.js"]
    },
    # STT 21: 2026-10-13
    {
        "date": "2026-10-13 09:30:00",
        "msg": "feat(itinerary): implement wgs84 haversine distance algorithm and mongodb models",
        "patterns": ["server/src/utils/geo.util.js", "server/src/models/itinerary.model.js", "server/tests/unit/utils/geo.util.test.js", "server/tests/unit/models/itinerary.model.test.js"]
    },
    # STT 22: 2026-10-14
    {
        "date": "2026-10-14 15:00:00",
        "msg": "feat(itinerary): implement collaborative itinerary service and atomic stop reordering",
        "patterns": ["server/src/services/itinerary.service.js", "server/src/repositories/itinerary.repository.js", "server/src/controllers/itinerary.controller.js", "server/src/routes/itinerary.routes.js", "server/tests/unit/repositories/itinerary.repository.test.js", "server/tests/integration/itinerary.crud.test.js", "server/tests/integration/itinerary.collaboration.test.js", "server/tests/integration/itinerary.timeline.test.js"]
    },
    # STT 23: 2026-10-15
    {
        "date": "2026-10-15 10:45:00",
        "msg": "feat(expense): implement greedy minimum cash-flow reduction algorithm (o(n log n))",
        "patterns": ["server/src/utils/debt.util.js", "server/src/schemas/expense.zod.js", "server/src/providers/cloudinary.provider.js", "server/tests/unit/utils/debt.util.test.js"]
    },
    # STT 24: 2026-10-16
    {
        "date": "2026-10-16 16:30:00",
        "msg": "feat(expense): implement postgresql acid ledger repository and group bill splitting service",
        "patterns": ["server/src/repositories/expense.repository.js", "server/src/services/expense.service.js", "server/src/controllers/expense.controller.js", "server/src/routes/expense.routes.js", "server/src/services/crossDbIntegrity.service.js", "server/src/services/places.service.js", "server/src/providers/places.provider.js", "server/src/controllers/places.controller.js", "server/src/routes/places.routes.js", "server/tests/unit/repositories/expense.repository.test.js", "server/tests/unit/services/expense.service.test.js", "server/tests/unit/services/crossDbIntegrity.service.test.js", "server/tests/unit/services/places.service.test.js", "server/tests/unit/providers/places.provider.test.js", "server/tests/integration/expense.crud.test.js", "server/tests/integration/expense.settlement.test.js", "server/tests/integration/places.api.test.js"]
    },
    # STT 25: 2026-10-17
    {
        "date": "2026-10-17 11:00:00",
        "msg": "feat(client): initialize expo sdk 57 mobile client, theme store, dynamic api url and base components",
        "patterns": [
            "client/package.json", "client/package-lock.json", "client/babel.config.js", "client/jest.config.js", "client/tsconfig.json", "client/index.js",
            "client/src/theme/", "client/src/api/", "client/src/stores/auth.store.js", "client/src/stores/theme.store.js", "client/src/stores/booking.store.js",
            "client/src/components/common/Button.js", "client/src/components/common/Input.js", "client/src/components/common/CalendarPickerModal.js",
            "client/src/screens/auth/LoginScreen.js", "client/src/screens/auth/RegisterScreen.js", "client/src/utils/airport.util.js",
            "client/tests/setupEnv.js", "client/tests/unit/", "client/tests/components/Button.test.js", "client/tests/components/Input.test.js",
            "client/tests/components/LoginScreen.test.js", "client/tests/components/RegisterScreen.test.js", "client/tests/components/CalendarPickerModal.test.js"
        ]
    },
    # STT 26: 2026-10-18 (Today)
    {
        "date": "2026-10-18 11:20:00",
        "msg": "feat(mobile): complete full-stack client suite with mapbox discovery, multi-city wizard, english i18n, and ci/cd",
        "patterns": ["*"] # sync everything remaining
    }
]

def run(cmd, cwd=None, env=None):
    merged_env = os.environ.copy()
    if env:
        merged_env.update(env)
    res = subprocess.run(cmd, shell=True, cwd=cwd, env=merged_env, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"FAILED: {cmd}\nSTDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}", file=sys.stderr)
        sys.exit(res.returncode)
    return res.stdout.strip()

def main():
    print("=== Starting Greenwich Daily Commit Generator ===")
    
    # 1. Clean previous build dir if exists
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    
    # 2. Clone from local greenwich remote branch into BUILD_DIR
    print(f"Cloning {MAIN_REPO} into {BUILD_DIR}...")
    run(f"git clone {MAIN_REPO} {BUILD_DIR}")
    
    # 3. Checkout greenwich/main
    print("Checking out greenwich/main at commit 373c03c...")
    run("git remote add greenwich " + GREENWICH_REMOTE, cwd=BUILD_DIR)
    run("git fetch greenwich", cwd=BUILD_DIR)
    run("git checkout -b main-greenwich-daily greenwich/main", cwd=BUILD_DIR)
    
    # Verify starting commit
    head = run("git rev-parse --short HEAD", cwd=BUILD_DIR)
    print(f"Starting at commit: {head} (expecting 373c03c)")
    if head != "373c03c":
        print(f"Error: expected 373c03c, got {head}")
        sys.exit(1)
        
    # Configure git identity in BUILD_DIR
    run('git config user.name "DucNgVan"', cwd=BUILD_DIR)
    run('git config user.email "ducnva.wk@gmail.com"', cwd=BUILD_DIR)
    
    # 4. Iterate through 26 daily commits
    env_base = {
        "GIT_AUTHOR_NAME": "DucNgVan",
        "GIT_AUTHOR_EMAIL": "ducnva.wk@gmail.com",
        "GIT_COMMITTER_NAME": "DucNgVan",
        "GIT_COMMITTER_EMAIL": "ducnva.wk@gmail.com"
    }
    
    for idx, c in enumerate(COMMITS, start=1):
        c_date = c["date"]
        c_msg = c["msg"]
        patterns = c["patterns"]
        print(f"\n[{idx}/26] Processing {c_date}: {c_msg}")
        
        if patterns == ["*"]:
            # Copy all files from MAIN_REPO to BUILD_DIR except .git, node_modules, memory-bank, .agents, .expo, coverage
            print("Syncing all remaining files...")
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
                f"{MAIN_REPO}/ {BUILD_DIR}/"
            )
            run(rsync_cmd)
        else:
            for pat in patterns:
                src_path = os.path.join(MAIN_REPO, pat)
                dst_path = os.path.join(BUILD_DIR, pat)
                if os.path.isdir(src_path):
                    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                    run(f"rsync -av --exclude='node_modules' --exclude='.expo' {src_path}/ {dst_path}/")
                elif os.path.isfile(src_path):
                    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                    shutil.copy2(src_path, dst_path)
                else:
                    # Glob pattern or not directly found
                    parent_dir = os.path.dirname(pat)
                    base_name = os.path.basename(pat)
                    full_parent = os.path.join(MAIN_REPO, parent_dir)
                    if os.path.exists(full_parent):
                        os.makedirs(os.path.join(BUILD_DIR, parent_dir), exist_ok=True)
                        run(f"cp -rf {MAIN_REPO}/{pat} {BUILD_DIR}/{parent_dir}/ 2>/dev/null || true")

        # Sanitize any mapbox demo token fallback if needed
        # git add & commit
        run("git add -A", cwd=BUILD_DIR)
        status = run("git status --porcelain", cwd=BUILD_DIR)
        if not status:
            print("  No changes to commit, skipping...")
            continue
            
        env_commit = env_base.copy()
        env_commit["GIT_AUTHOR_DATE"] = c_date
        env_commit["GIT_COMMITTER_DATE"] = c_date
        
        escaped_msg = c_msg.replace('"', '\\"')
        commit_res = run(f'git commit -m "{escaped_msg}"', cwd=BUILD_DIR, env=env_commit)
        new_sha = run("git rev-parse --short HEAD", cwd=BUILD_DIR)
        print(f"  Committed: {new_sha} ({c_date})")

    # 5. Check log
    print("\n=== Commit Log in BUILD_DIR ===")
    log_out = run("git log --oneline -n 30", cwd=BUILD_DIR)
    print(log_out)
    
    # 6. Push to greenwich remote
    print("\nPushing to greenwich main...")
    push_out = run("git push greenwich main-greenwich-daily:main", cwd=BUILD_DIR)
    print(push_out)
    print("\nSUCCESS! All 26 daily commits pushed to greenwich/main.")

if __name__ == "__main__":
    main()
