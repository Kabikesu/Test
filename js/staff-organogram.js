(function () {
    'use strict';

    const root = document.querySelector('[data-staff-organogram]');

    if (!root) return;

    /* =========================================================
       HELPERS
    ========================================================= */

    const esc = value =>
        String(value ?? '').replace(/[&<>'"]/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[character]));

    const cleanName = name =>
        String(name || '').replace(
            /^(Datuk Dr|Mr|Mrs|Ms|Dr)\.?\s+/i,
            ''
        );

    const initials = name =>
        cleanName(name)
            .split(/\s+/)
            .filter(Boolean)
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

    const bioFor = person => {
        if (person.bio) return person.bio;

        const role = String(person.role || '').toLowerCase();

        if (role.includes('microbiolog')) {
            return 'Supports microbiological quality activities and laboratory controls that help maintain product quality, hygiene, and compliance standards.';
        }

        if (role.includes('it')) {
            return 'Supports IT infrastructure, systems, users, connectivity, cybersecurity, and day-to-day technology operations across the organization.';
        }

        if (role.includes('finance') || role.includes('account')) {
            return 'Supports financial operations, accounting activities, reporting, controls, and timely coordination of finance requirements.';
        }

        if (role.includes('hr') || role.includes('human')) {
            return 'Supports people operations, employee administration, HR coordination, and workplace services.';
        }

        if (role.includes('procurement') || role.includes('purchase')) {
            return 'Supports sourcing, purchasing coordination, supplier communication, and procurement activities for operational requirements.';
        }

        if (role.includes('warehouse')) {
            return 'Supports warehouse operations, inventory handling, material coordination, and organized movement of goods.';
        }

        if (role.includes('quality') || role.includes('qc')) {
            return 'Supports quality control activities, inspection, documentation, and coordination of quality requirements.';
        }

        if (
            role.includes('engineering') ||
            role.includes('technician') ||
            role.includes('electrical')
        ) {
            return 'Supports engineering, equipment, electrical, maintenance, and technical activities required for reliable operations.';
        }

        if (role.includes('utility')) {
            return 'Supports utility operations and technical services that help maintain reliable factory facilities and production support systems.';
        }

        if (
            role.includes('production') ||
            role.includes('operator') ||
            role.includes('packing') ||
            role.includes('filling')
        ) {
            return 'Contributes to safe, efficient, and consistent production activities within the assigned manufacturing unit.';
        }

        if (
            role.includes('admin') ||
            role.includes('driver') ||
            role.includes('housekeeping') ||
            role.includes('assistant')
        ) {
            return 'Supports administration and day-to-day workplace operations, helping maintain smooth and efficient factory activities.';
        }

        return 'Contributes to the successful operation of Dexin Manufacturing Nepal through responsibilities within the assigned role and department.';
    };


    /* =========================================================
       PHOTO
    ========================================================= */

    const photoMarkup = person => {
        if (person.photo) {
            return `
                <img
                    src="${esc(person.photo)}"
                    alt="${esc(person.name)}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
                >
                <span
                    class="staff-photo-placeholder"
                    aria-hidden="true"
                    hidden
                >${esc(initials(person.name))}</span>
            `;
        }

        return `
            <span
                class="staff-photo-placeholder"
                aria-hidden="true"
            >${esc(initials(person.name))}</span>
        `;
    };


    /* =========================================================
       PERSON CARD
    ========================================================= */

    const personCard = (person, isHead, extraClass = '') => {

        const isFounder =
            person.name === 'Datuk Dr Lim Siow Jin';

        let headLabel = '';

        if (isFounder) {
            headLabel = '<small>FOUNDER OF DXN</small>';
        } else if (isHead) {
            headLabel = `
                <small>HEAD OF DEPARTMENT</small>
                <small class="reporting-label">REPORTING TO FPIC</small>
            `;
        }

        return `
            <button
                type="button"
                class="team-member-card ${isHead ? 'team-member-head' : ''} ${extraClass}"
                data-person='${esc(JSON.stringify(person))}'
                aria-label="View profile of ${esc(cleanName(person.name))}"
            >
                <span class="team-member-photo">
                    ${photoMarkup(person)}
                    <span class="team-member-open">
                        View profile
                    </span>
                </span>

                <span class="team-member-label">
                    ${headLabel}

                    <strong>
                        ${esc(cleanName(person.name))}
                    </strong>

                    <em>
                        ${esc(person.role || '')}
                    </em>
                </span>
            </button>
        `;
    };


    /* =========================================================
       DEPARTMENT NORMALIZATION
    ========================================================= */

    const normalizeDepartment = department => ({
        name: department.name,
        head: department.head || null,
        members: department.members || [],
        groups: department.groups || []
    });


    /* =========================================================
       EXECUTIVE LEADERSHIP
    ========================================================= */

    const leadershipPanel = data => {

        const [
            founder,
            rajesh,
            giri,
            rakesh,
            brijesh
        ] = data.leadership || [];

        return `
            <div class="executive-hierarchy">

                ${
                    founder
                        ? `
                            <div class="executive-level executive-founder-level">
                                ${personCard(
                                    founder,
                                    false,
                                    'executive-chairman-card'
                                )}
                            </div>
                        `
                        : ''
                }

                ${
                    founder && (rajesh || giri)
                        ? '<div class="executive-connector"></div>'
                        : ''
                }

                ${
                    rajesh || giri
                        ? `
                            <div class="executive-level executive-senior-level">

                                ${
                                    rajesh
                                        ? personCard(
                                            rajesh,
                                            false,
                                            'executive-senior-card'
                                        )
                                        : ''
                                }

                                ${
                                    giri
                                        ? personCard(
                                            giri,
                                            false,
                                            'executive-senior-card'
                                        )
                                        : ''
                                }

                            </div>
                        `
                        : ''
                }

                ${
                    rakesh
                        ? `
                            <div class="executive-connector executive-connector-down"></div>

                            <div class="executive-level executive-fpic-level">
                                ${personCard(
                                    rakesh,
                                    true,
                                    'executive-fpic-card'
                                )}
                            </div>
                        `
                        : ''
                }

                ${
                    brijesh
                        ? `
                            <div class="executive-subordinate-line"></div>

                            <div class="executive-level executive-deputy-level">

                                <div class="executive-under-label">
                                    REPORTING TO FPIC
                                </div>

                                ${personCard(
                                    brijesh,
                                    false,
                                    'executive-deputy-card'
                                )}

                            </div>
                        `
                        : ''
                }

            </div>
        `;
    };


    /* =========================================================
       BUILD ORGANOGRAM
    ========================================================= */

    const build = data => {

        const departments = [
            {
                name: 'Executive Leadership',
                leadership: true,
                count: (data.leadership || []).length
            },
            ...(data.departments || []).map(normalizeDepartment)
        ];


        root.innerHTML = `
            <div class="team-intro">
                <p>
                    Explore the leadership structure and departments of
                    Dexin Manufacturing Nepal.
                    <strong>
                        All Department Heads report directly to
                        Mr. Rakesh Kumar Karn, Factory PIC (FPIC).
                    </strong>
                    Click a department or leadership level to discover
                    individual profiles.
                </p>
            </div>

            <div class="team-department-grid">

                ${departments.map(department => {

                    /* =================================================
                       EXECUTIVE LEADERSHIP
                    ================================================= */

                    if (department.leadership) {

                        return `
                            <section
                                class="team-department leadership-department"
                                data-department
                            >

                                <button
                                    type="button"
                                    class="department-toggle"
                                    aria-expanded="false"
                                >
                                    <span class="department-icon">
                                        L
                                    </span>

                                    <span class="department-copy">
                                        <strong>
                                            Executive Leadership
                                        </strong>

                                        <small>
                                            ${department.count}
                                            leadership positions
                                        </small>
                                    </span>

                                    <span
                                        class="department-chevron"
                                        aria-hidden="true"
                                    >+</span>
                                </button>

                                <div
                                    class="department-panel"
                                    hidden
                                >
                                    ${leadershipPanel(data)}
                                </div>

                            </section>
                        `;
                    }


                    /* =================================================
                       MEMBER COUNT
                    ================================================= */

                    const count = department.groups.length
                        ? department.groups.reduce(
                            (total, group) =>
                                total +
                                1 +
                                (group.members || []).length,
                            0
                        )
                        : (department.head ? 1 : 0) +
                          department.members.length;


                    /* =================================================
                       NORMAL DEPARTMENT
                    ================================================= */

                    return `
                        <section
                            class="team-department"
                            data-department
                        >

                            <button
                                type="button"
                                class="department-toggle"
                                aria-expanded="false"
                            >

                                <span class="department-icon">
                                    ${esc(
                                        department.name.charAt(0)
                                    )}
                                </span>

                                <span class="department-copy">

                                    <strong>
                                        ${esc(department.name)}
                                    </strong>

                                    <small>
                                        ${count}
                                        team member${count === 1 ? '' : 's'}
                                    </small>

                                </span>

                                <span
                                    class="department-chevron"
                                    aria-hidden="true"
                                >+</span>

                            </button>


                            <div
                                class="department-panel"
                                hidden
                            >

                                ${
                                    department.groups.length
                                        ? `
                                            <div class="team-unit-grid">

                                                ${department.groups.map(group => `

                                                    <div class="team-unit">

                                                        <div class="team-unit-title">

                                                            <h3>
                                                                ${esc(group.name)}
                                                            </h3>

                                                            <span>
                                                                ${
                                                                    1 +
                                                                    (group.members || []).length
                                                                }
                                                                members
                                                            </span>

                                                        </div>


                                                        ${
                                                            group.head
                                                                ? personCard(
                                                                    group.head,
                                                                    true
                                                                )
                                                                : ''
                                                        }


                                                        <div class="team-member-grid">

                                                            ${
                                                                (group.members || [])
                                                                    .map(member =>
                                                                        personCard(
                                                                            member,
                                                                            false
                                                                        )
                                                                    )
                                                                    .join('')
                                                            }

                                                        </div>

                                                    </div>

                                                `).join('')}

                                            </div>
                                        `
                                        : `
                                            <div class="team-member-grid department-members">

                                                ${
                                                    department.head
                                                        ? personCard(
                                                            department.head,
                                                            true
                                                        )
                                                        : ''
                                                }

                                                ${
                                                    department.members
                                                        .map(member =>
                                                            personCard(
                                                                member,
                                                                false
                                                            )
                                                        )
                                                        .join('')
                                                }

                                            </div>
                                        `
                                }

                            </div>

                        </section>
                    `;

                }).join('')}

            </div>


            <!-- PROFILE MODAL -->

            <div
                class="team-profile-modal"
                data-profile-modal
                hidden
            >

                <div
                    class="team-profile-backdrop"
                    data-profile-close
                ></div>

                <div
                    class="team-profile-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="profile-name"
                >

                    <button
                        type="button"
                        class="team-profile-close"
                        data-profile-close
                        aria-label="Close profile"
                    >
                        &times;
                    </button>

                    <div
                        class="team-profile-content"
                        data-profile-content
                    ></div>

                </div>

            </div>
        `;


        /* =========================================================
           DEPARTMENT TOGGLES
        ========================================================= */

        root
            .querySelectorAll('.department-toggle')
            .forEach(toggle => {

                toggle.addEventListener('click', () => {

                    const section =
                        toggle.closest('[data-department]');

                    const panel =
                        section.querySelector('.department-panel');

                    const isOpen =
                        toggle.getAttribute('aria-expanded') === 'true';

                    toggle.setAttribute(
                        'aria-expanded',
                        String(!isOpen)
                    );

                    panel.hidden = isOpen;

                    section.classList.toggle(
                        'is-open',
                        !isOpen
                    );

                    const chevron =
                        toggle.querySelector(
                            '.department-chevron'
                        );

                    if (chevron) {
                        chevron.textContent =
                            isOpen ? '+' : '−';
                    }

                });

            });


        /* =========================================================
           PROFILE MODAL
        ========================================================= */

        const modal =
            root.querySelector('[data-profile-modal]');

        const content =
            root.querySelector('[data-profile-content]');


        const closeModal = () => {

            modal.hidden = true;

            document.body.classList.remove(
                'profile-modal-open'
            );

        };


        root
            .querySelectorAll('.team-member-card')
            .forEach(button => {

                button.addEventListener('click', () => {

                    let person;

                    try {
                        person = JSON.parse(
                            button.dataset.person
                        );
                    } catch (error) {
                        console.error(
                            'Unable to read staff profile:',
                            error
                        );
                        return;
                    }


                    const email =
                        person.email || '';

                    const linkedin =
                        person.linkedin || '';

                    const isFounder =
                        person.name ===
                        'Datuk Dr Lim Siow Jin';


                    content.innerHTML = `

                        <div
                            class="profile-photo-large ${
                                isFounder
                                    ? 'founder-profile-photo'
                                    : ''
                            }"
                        >
                            ${photoMarkup(person)}
                        </div>


                        <div
                            class="profile-details ${
                                isFounder
                                    ? 'founder-profile-details'
                                    : ''
                            }"
                        >

                            ${
                                button.classList.contains(
                                    'team-member-head'
                                ) && !isFounder
                                    ? `
                                        <span class="profile-badge">
                                            EXECUTIVE LEADERSHIP
                                        </span>
                                    `
                                    : ''
                            }

                            <span class="profile-eyebrow">
                                DEXIN MANUFACTURING NEPAL
                            </span>

                            <h3 id="profile-name">
                                ${esc(cleanName(person.name))}
                            </h3>

                            <p class="profile-role">
                                ${esc(person.role || '')}
                            </p>

                            <div class="profile-divider"></div>

                            <p class="profile-bio">
                                ${esc(bioFor(person))}
                            </p>

                            <div class="profile-contact">

                                ${
                                    email
                                        ? `
                                            <a
                                                href="mailto:${esc(email)}"
                                            >
                                                <span>✉</span>
                                                ${esc(email)}
                                            </a>
                                        `
                                        : `
                                            <span class="profile-unavailable">
                                                Professional email not published
                                            </span>
                                        `
                                }

                                ${
                                    linkedin
                                        ? `
                                            <a
                                                href="${esc(linkedin)}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span>in</span>
                                                LinkedIn
                                            </a>
                                        `
                                        : ''
                                }

                            </div>

                        </div>

                    `;


                    modal.hidden = false;

                    document.body.classList.add(
                        'profile-modal-open'
                    );

                });

            });


        /* =========================================================
           CLOSE MODAL
        ========================================================= */

        root
            .querySelectorAll('[data-profile-close]')
            .forEach(element => {

                element.addEventListener(
                    'click',
                    closeModal
                );

            });


        document.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Escape' &&
                    !modal.hidden
                ) {
                    closeModal();
                }

            }
        );

    };


        /* =========================================================
       LOAD STAFF DATA
    ========================================================= */

    fetch('data/staff.json', {
        cache: 'no-store'
    })
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    'Staff data unavailable'
                );
            }

            return response.json();

        })
        .then(data => {

            build(data);

        })
        .catch(error => {

            console.error(
                'Staff organogram error:',
                error
            );

            root.innerHTML = `
                <div class="staff-empty">
                    <strong>Staff team data could not be loaded.</strong>
                    <br>
                    <small>${esc(error.message)}</small>
                </div>
            `;
        });

})();