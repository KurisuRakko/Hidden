const enMessages = {
  common: {
    appName: "Hidden",
    languageName: "English",
    languageLabel: "Language",
    optional: "Optional",
    notSet: "Not set",
    enabled: "Enabled",
    disabled: "Disabled",
    loading: "Loading...",
    menu: "Menu",
    adminSessionActive: "Admin session active",
    adminSessionOnPublicSite: "Admin session active on the public site.",
    actions: {
      createAccount: "Create account",
      register: "Register",
      signIn: "Sign in",
      signOut: "Sign out",
      dashboard: "Dashboard",
      openAdminPortal: "Open admin portal",
      save: "Save",
      saveChanges: "Save changes",
      saving: "Saving...",
      publish: "Publish",
      reply: "Reply",
      copyLink: "Copy link",
      openPublicPage: "Open public page",
      manageBox: "Manage this box",
      back: "Back",
      close: "Close",
      filter: "Filter",
      previous: "Previous",
      next: "Next",
      uploadImage: "Upload image",
      about: "About",
      visitWebsite: "Visit website",
      viewRepository: "View repository",
      viewProject: "Project page",
      sendEmail: "Send email",
    },
    nav: {
      questions: "My boxes",
      create: "Create",
      me: "Me",
      createBox: "New box",
    },
    status: {
      ACTIVE: "Active",
      HIDDEN: "Hidden",
      DISABLED: "Disabled",
      BANNED: "Banned",
      PENDING: "Pending",
      ANSWERED: "Answered",
      PUBLISHED: "Published",
      REJECTED: "Rejected",
      DELETED: "Deleted",
    },
    role: {
      USER: "User",
      ADMIN: "Administrator",
    },
    localeOption: {
      "zh-CN": "Simplified Chinese",
      en: "English",
    },
    fileUpload: {
      noFileSelected: "No file selected",
      selectedFile: "Selected: {name}",
    },
    feedback: {
      networkError: "Network request failed. Please try again.",
      requestFailed: "Request failed.",
    },
  },
  site: {
    description: "Anonymous question boxes with moderation and invite-only registration.",
    tagline: "Anonymous inboxes with moderation",
  },
  home: {
    badge: "Invite-only",
    title: "Hidden is a moderated anonymous inbox.",
    description:
      "Collect anonymous questions, then review, answer, and publish on your terms.",
    features: {
      publicBoxesTitle: "Public question boxes",
      publicBoxesDescription: "Each box has its own public page.",
      moderationTitle: "Moderation-first workflow",
      moderationDescription: "Review questions before they go public.",
      inviteOnlyTitle: "Invite-only growth",
      inviteOnlyDescription: "Invite codes keep sign-ups controlled.",
    },
  },
  about: {
    metadataTitle: "About KurisuRakko",
    metadataDescription:
      "Learn about KurisuRakko, the official site, support contact, and the Hidden project repository.",
    badge: "About the creator",
    title: "KurisuRakko builds Hidden with a moderation-first, MD2-inspired approach.",
    description:
      "This page collects the official links for KurisuRakko and gives you a clean path into the Hidden project overview.",
    cards: {
      officialSiteEyebrow: "Official site",
      officialSiteTitle: "rakko.cn",
      officialSiteDescription:
        "Visit the KurisuRakko site for the canonical public identity and broader project context.",
      repositoryEyebrow: "Source code",
      repositoryTitle: "Hidden on GitHub",
      repositoryDescription:
        "Browse the repository, issues, and implementation details for Hidden.",
      supportEyebrow: "Contact",
      supportTitle: "Email support",
      supportDescription:
        "Reach out directly when you need help with Hidden or related project questions.",
      projectEyebrow: "Project guide",
      projectTitle: "About Hidden",
      projectDescription:
        "Read the product goals, capabilities, stack, and deployment shape in one focused page.",
    },
    overviewTitle: "Who is KurisuRakko",
    overviewDescription:
      "KurisuRakko is the author and maintainer behind Hidden. The official links are collected here so visitors can see who built the project and where the canonical references live.",
    overviewPoints: {
      identity:
        "Maintains the public identity at rakko.cn and keeps Hidden connected to a clear official source.",
      product:
        "Builds Hidden as a moderated anonymous inbox with straightforward public flows and practical creator controls.",
      engineering:
        "Keeps the implementation compact with Next.js, TypeScript, MUI, Prisma, PostgreSQL, MinIO, and Docker Compose.",
    },
    principlesTitle: "What this project values",
    principlesDescription:
      "The public experience follows a few stable principles that already show up across the codebase and docs.",
    principles: {
      moderationTitle: "Moderation first",
      moderationDescription:
        "Anonymous questions are reviewed before publication so creators stay in control.",
      inviteTitle: "Controlled growth",
      inviteDescription:
        "Invite-only registration keeps the early product manageable without extra complexity.",
      md2Title: "Material Design 2",
      md2Description:
        "The UI favors MD2-style cards, elevation, and readable hierarchy over flashy effects.",
    },
    projectCtaAction: "Open project page",
    closingTitle: "Continue into the Hidden project details",
    closingDescription:
      "Use the project page when you want the full product, stack, and deployment overview, or jump out to the official site for broader context.",
  },
  project: {
    metadataTitle: "About the Hidden project",
    metadataDescription:
      "Overview of Hidden, including product goals, role model, tech stack, and deployment shape.",
    badge: "About the project",
    title: "Hidden is an invite-only anonymous inbox built for moderated publishing.",
    description:
      "The project combines lightweight public pages with structured review tools so visitors, creators, and administrators each get a clear path.",
    summaryTitle: "Project overview",
    summaryDescription:
      "Hidden focuses on a simple MVP that can ship quickly while leaving room for stronger anti-abuse controls and future verification.",
    summaryPoints: {
      visitors:
        "Visitors can open a public box, browse published answers, and submit one anonymous question with an optional image.",
      users:
        "Registered users can manage multiple boxes, review pending questions, answer them, and decide what becomes public.",
      admins:
        "Administrators can monitor users, boxes, questions, invite codes, and platform activity from one internal portal.",
    },
    capabilitiesTitle: "Core capabilities",
    capabilitiesDescription:
      "These are the main product flows already described in the repository docs.",
    capabilities: {
      registrationTitle: "Invite-based accounts",
      registrationDescription:
        "Phone number, password, and invite code registration with server-side session authentication.",
      boxesTitle: "Multi-box ownership",
      boxesDescription:
        "Each signed-in user can create and configure multiple question boxes with their own public slugs.",
      moderationTitle: "Review and publish workflow",
      moderationDescription:
        "Questions enter a pending state first, then can be answered, published, rejected, or deleted.",
      governanceTitle: "Admin governance",
      governanceDescription:
        "The admin portal covers user status, box status, question moderation, invite codes, and audit logs.",
    },
    stackTitle: "Technical stack",
    stackDescription:
      "The implementation stays intentionally compact by keeping product pages, dashboards, APIs, and authentication in one Next.js codebase.",
    stack: {
      frontendTitle: "Next.js + TypeScript",
      frontendDescription:
        "App Router handles the public site, dashboards, server rendering, and API routes in one repository.",
      uiTitle: "MUI with MD2 direction",
      uiDescription:
        "The UI uses MUI with an MD2-inspired theme, card grouping, and clear visual hierarchy.",
      dataTitle: "Prisma + PostgreSQL + MinIO",
      dataDescription:
        "Relational data lives in PostgreSQL through Prisma, while uploaded media is stored in MinIO.",
      opsTitle: "Docker-first operations",
      opsDescription:
        "Docker Compose runs the proxy, web app, database, and object storage together for local and server deployments.",
    },
    deploymentTitle: "Deployment shape",
    deploymentDescription:
      "The repository documents three practical ways to run Hidden today.",
    deployment: {
      localTitle: "Local machine",
      localDescription:
        "Run the full stack with Docker Compose for development on one computer.",
      lanTitle: "LAN or private network",
      lanDescription:
        "Expose the public site and optional admin access to devices on the same network.",
      internetTitle: "Internet-facing host",
      internetDescription:
        "Place the public site behind a domain and TLS proxy while keeping the admin listener protected.",
    },
    linksTitle: "Project links",
    linksDescription:
      "Use these canonical sources when you want the current codebase or official project context.",
    links: {
      repositoryEyebrow: "Repository",
      repositoryTitle: "GitHub source",
      repositoryDescription:
        "Browse the current implementation, issues, and change history for Hidden.",
      officialEyebrow: "Official site",
      officialTitle: "KurisuRakko site",
      officialDescription:
        "See the broader creator context and official external presence for the project.",
      contactEyebrow: "Support",
      contactTitle: "Email",
      contactDescription:
        "Use email when you need direct human contact for Hidden-related questions.",
    },
    ctaAction: "Back to about",
    closingTitle: "Keep exploring the official project context",
    closingDescription:
      "Open the repository when you want the code, or go back to the about page for the creator-facing overview and official links.",
  },
  auth: {
    disabledNotice:
      "Your account is not active right now. Please contact an administrator.",
    adminTitle: "Admin sign in",
    adminDescription: "Access the internal admin portal.",
    loginTitle: "Sign in",
    loginDescription: "Enter your phone number and password.",
    loginDescriptionWithOidc:
      "Continue with {provider} first, or use the legacy phone sign-in below.",
    registerTitle: "Create account",
    registerDescription: "Register with an invite code.",
    registerDescriptionWithOidc:
      "Continue with {provider} to create your account, or use the legacy invite registration below.",
    countryCode: "Country code",
    phoneNumber: "Phone number",
    phonePlaceholder: "138 0013 8000",
    phoneHelper: "Enter your local number.",
    password: "Password",
    inviteCode: "Invite code",
    oidcPrimaryAction: "Continue with {provider}",
    oidcLoginDescription:
      "This is the preferred public sign-in flow and will reuse your Hidden session once you return.",
    oidcRegisterDescription:
      "First-time sign-in through {provider} creates your Hidden account automatically.",
    legacyLoginDivider: "Legacy phone sign-in",
    legacyRegisterDivider: "Legacy invite registration",
    oidcUnavailableNotice:
      "{provider} sign-in is not configured right now. You can still use the legacy form below.",
    oidcFailedNotice:
      "{provider} sign-in could not be completed. Please try again or use the legacy form below.",
    submit: "Submitting...",
    signInToAdmin: "Sign in to admin",
    registerAction: "Register",
    validation: {
      localPhoneRequired:
        "Enter a valid local phone number before continuing.",
      passwordRequired: "Enter your password before continuing.",
      inviteCodeRequired:
        "Enter your invite code before creating an account.",
    },
  },
  publicBox: {
    defaultDescription: "Ask anonymously.",
    pausedNotice: "This box is not accepting new questions right now.",
    heroEyebrow: "Published Q&A",
    askTitle: "Ask something new",
    askDescription:
      "Browse the published answers first, then open a dedicated page when you are ready to send an anonymous question.",
    askAction: "Ask anonymously",
    publishedAnswersTitle: "Published answers",
    publishedAnswersDescription: "Only public answers appear here.",
    noAnswers: "No public answers yet.",
    noAnswersDescription:
      "Nothing has been published yet. When you are ready, use the button above to send the first anonymous question.",
    publishedAt: "Published {value}",
    questionTitle: "Question",
    answerTitle: "Answer",
    questionAttachmentAlt: "Question attachment",
    answerAttachmentAlt: "Answer attachment",
  },
  publicAsk: {
    eyebrow: "Anonymous question",
    title: "Write your question",
    description:
      "Send an anonymous question to {title}. It will be reviewed before anything is published.",
    pausedDescription:
      "This box is paused for new questions right now, but you can still go back and browse the published Q&A.",
    backToBox: "Back to published Q&A",
    backToPublished: "Back to published Q&A",
  },
  publicQuestionForm: {
    success: "Question received.",
    successTitle: "Question received",
    successDescription:
      "Your question has been sent anonymously and is now waiting for review.",
    questionLabel: "Your anonymous question",
    imageHelper:
      "Optional image, up to 5 MB. JPG, PNG, and WEBP are supported.",
    attachImage: "Attach image",
    submit: "Send anonymously",
    submitting: "Submitting...",
    submitError: "Unable to submit question.",
    backToPublished: "Back to published Q&A",
    askAnother: "Ask another question",
  },
  dashboard: {
    lightMode: "Light",
    darkMode: "Dark",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    accountInfoTitle: "Account",
    themeTitle: "Theme",
    languageTitle: "Language",
    currentMode: "Current mode: {mode}",
    themeScope: "Only affects the dashboard.",
    accountIdentifier: "Account: {value}",
    accountRole: "Role: {role}",
    accountCreatedAt: "Created: {value}",
    passwordTitle: "Change password",
    passwordManagedByOidc: "Signed in with {provider}",
    passwordManagedByOidcDescription:
      "This account signs in through {provider}. A local password is not set, so password changes are unavailable here.",
    logoutTitle: "Sign out",
    myBoxesTitle: "My boxes",
    noBoxesTitle: "No boxes yet",
    noBoxesDescription:
      "Create your first box and it will appear here once it is ready.",
    newBoxPageTitle: "New box",
    newBoxTitle: "New box",
    createdPageTitle: "Created",
    createdSuccess: "Box created",
    meSettingsTitle: "Personal settings",
    meSettingsDescription: "Manage account, preferences, and security by category.",
    personalSettings: {
      accountTitle: "Account",
      accountDescription: "Review account identifier, role, and account creation details.",
      preferencesTitle: "Preferences",
      preferencesDescription: "Adjust theme and language in one place.",
      securityTitle: "Security",
      securityDescription: "Update your password and sign out from the current device.",
    },
    detailSettingsAria: "Question box settings",
    detailSettingsDescription:
      "Update the name, description, link, wallpaper, and whether this box accepts new questions.",
    detailSettingsAction: "Open box settings",
    detailManageDescription:
      "Stay focused on moderation here, then open settings only when you need to update this box.",
    metricTotalQuestions: "Total questions",
    metricPendingQuestions: "Pending questions",
    metricPublishedQuestions: "Published questions",
    metricAccepting: "Still accepting new questions",
    metricPaused: "Currently paused",
    summaryAcceptingLabel: "Accepting new questions",
    detailQuestionsTitle: "Questions",
    noQuestionsTitle: "No questions yet",
    noQuestionsDescription:
      "Questions will appear here after someone submits to this box.",
    settingsTitle: "Box settings",
    backToQuestions: "Back to questions",
    logoutDescription: "Sign out of the current session when you are done using this device.",
    publicPageTitle: "Public page",
    publicPageDescription:
      "Open the public page, copy the box link, and quickly review the current box status.",
    summaryTitle: "Summary",
    summaryStatus: "Status: {value}",
    summaryAccepting: "Accepting questions: {value}",
    summaryWallpaper: "Wallpaper: {value}",
    summaryQuestions: "Questions received: {count}",
    wallpaperSet: "Set",
    wallpaperUnset: "Not set",
    acceptingOn: "On",
    acceptingOff: "Off",
    boxForm: {
      saveError: "Unable to save the box.",
      basicsTitle: "Basic information",
      basicsDescription: "Set the box name, description, and public link.",
      title: "Box title",
      description: "Description",
      slug: "Public slug",
      slugHelper: "Public URLs use /s/[slug].",
      wallpaperTitle: "Wallpaper",
      wallpaperDescription: "Update the header image used on the public ask page.",
      wallpaperHelper:
        "Optionally upload a wallpaper for the public question page header. Uploading a new image replaces the old one.",
      wallpaperAlt: "Current box wallpaper",
      uploadWallpaper: "Upload wallpaper",
      keepWallpaper: "Keep current wallpaper",
      noWallpaper: "No wallpaper selected",
      removeWallpaper: "Remove current wallpaper",
      restoreWallpaper: "Restore current wallpaper",
      availabilityTitle: "Availability",
      availabilityDescription:
        "Control whether the box is visible and whether it can accept new anonymous questions.",
      visibility: "Visibility",
      acceptQuestions: "Accept new anonymous questions",
      create: "Create box",
      publish: "Publish box",
    },
    share: {
      copied: "Box link copied.",
      copyFailed: "Copy failed. Please copy the link manually.",
      shareUrl: "Box link",
      share: "Share box",
      open: "Open public page",
      manage: "Manage this box",
    },
    boxCard: {
      noDescription: "No description yet.",
      accepting: "Accepting questions",
      paused: "Paused",
      questionCount: "{count} questions",
      open: "Open",
    },
    ownerQuestion: {
      anonymousQuestion: "Anonymous question",
      submittedAt: "Submitted {value}",
      publishedAt: "Published {value}",
      draftHint:
        "A draft answer already exists. Click Reply to continue editing.",
      collapseReply: "Collapse reply",
      blocked: "Blocked",
      block: "Block",
      unblock: "Unblock",
      blockError: "Unable to block the question.",
      unblockError: "Unable to unblock the question.",
      blockedSuccess: "Question blocked.",
      unblockedSuccess: "Question unblocked.",
      replyContent: "Reply",
      replyImageHelper:
        "Optionally upload an answer image. Uploading a new one replaces the previous image.",
      uploadReplyImage: "Upload answer image",
      saveReply: "Save reply",
      publishQuestion: "Publish this question",
      saveReplyError: "Unable to save the answer.",
      saveReplySuccess: "Answer saved.",
      publishError: "Unable to publish the question.",
      publishSuccess: "Question published.",
    },
    changePassword: {
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      updating: "Updating...",
      update: "Update password",
      validation: {
        currentPasswordRequired: "Enter your current password.",
        newPasswordRequired: "Enter a new password.",
        passwordMismatch: "New password and confirmation do not match.",
        passwordUnchanged:
          "Choose a different password from your current one.",
      },
      successSignedOut:
        "Password updated. Other signed-in devices were signed out.",
      success: "Password updated successfully.",
    },
    language: {
      current: "Current language: {language}",
      helper: "Also used on the public site.",
      updating: "Updating...",
      updateSuccess: "Language preference updated.",
      updateError: "Unable to update the language preference.",
    },
  },
  errors: {
    PHONE_TAKEN: "This phone number is already registered.",
    INVITE_INVALID: "Invite code is invalid.",
    INVITE_EXPIRED: "Invite code has expired.",
    INVITE_EXHAUSTED: "Invite code has reached its usage limit.",
    LOGIN_FAILED: "Phone number or password is incorrect.",
    ADMIN_PORTAL_REQUIRED:
      "Administrator accounts must sign in through the internal admin portal.",
    ADMIN_ONLY_PORTAL: "This login is reserved for administrator accounts.",
    USER_DISABLED:
      "This account is disabled. Please contact an administrator.",
    UNAUTHORIZED: "Authentication required.",
    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    PASSWORD_UNCHANGED:
      "New password must be different from your current password.",
    PASSWORD_SIGN_IN_UNAVAILABLE:
      "This account does not have a local password sign-in.",
    SLUG_TAKEN: "Slug is already taken.",
    BOX_NOT_FOUND: "Question box not found.",
    QUESTION_NOT_FOUND: "Question not found.",
    QUESTION_REJECTED: "Rejected questions cannot be changed this way.",
    QUESTION_NOT_BLOCKED: "Only blocked questions can be restored.",
    ANSWER_REQUIRED: "Add an answer before publishing.",
    BOX_CLOSED: "This box is not accepting new questions.",
    RATE_LIMITED:
      "Too many submissions from this address. Please try again later.",
    INVALID_FILE_TYPE: "Only JPG, PNG, or WEBP images are allowed.",
    FILE_TOO_LARGE: "Image size must stay below 5 MB.",
    VALIDATION_ERROR: "Please check the submitted fields.",
    OIDC_CALLBACK_INVALID: "The sign-in response is incomplete.",
    OIDC_DISCOVERY_FAILED: "Unable to contact the sign-in provider.",
    OIDC_NONCE_INVALID: "The sign-in session could not be verified.",
    OIDC_PROFILE_INVALID: "The sign-in profile could not be verified.",
    OIDC_STATE_EXPIRED: "The sign-in session expired. Please try again.",
    OIDC_STATE_INVALID: "The sign-in session is invalid.",
    OIDC_TOKEN_EXCHANGE_FAILED: "Unable to complete the sign-in exchange.",
    OIDC_USERINFO_FAILED: "Unable to load your sign-in profile.",
    INTERNAL_SERVER_ERROR: "Internal server error",
  },
  validation: {
    phoneInvalid: "Enter a valid phone number.",
    passwordRequired: "Password is required.",
    inviteCodeRequired: "Invite code is required.",
    inviteCodeTooLong: "Invite code is too long.",
    slugInvalid:
      "Slug must use lowercase letters, numbers, and hyphens only.",
    titleTooShort: "Title is too short.",
    titleTooLong: "Title is too long.",
    descriptionTooLong: "Description is too long.",
    questionTooShort: "Question is too short.",
    questionTooLong: "Question is too long.",
    answerEmpty: "Answer cannot be empty.",
    answerTooLong: "Answer is too long.",
    requestFailed: "Request validation failed",
  },
} as const;

export default enMessages;
