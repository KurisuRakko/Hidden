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
    badge: "Invite-only anonymous Q&A",
    title: "Hidden gives every creator a calm, moderated anonymous inbox.",
    description:
      "Visitors ask freely. Owners review first, answer at their own pace, and publish only what deserves a place on the public page.",
    features: {
      publicBoxesTitle: "Public question boxes",
      publicBoxesDescription:
        "Each box gets a clean public page at /b/[slug] with published answers and a one-image anonymous submission form.",
      moderationTitle: "Moderation-first workflow",
      moderationDescription:
        "Every new question starts pending. Users can reject, delete, answer, and publish without exposing drafts.",
      inviteOnlyTitle: "Invite-only growth",
      inviteOnlyDescription:
        "Registration uses phone number, password, and invite code so the first version stays controlled and operable.",
    },
  },
  auth: {
    disabledNotice:
      "Your account is not active right now. Please contact an administrator.",
    adminTitle: "Admin sign in",
    adminDescription:
      "Use the internal admin portal to review users, questions, and moderation logs.",
    loginTitle: "Sign in",
    loginDescription: "Use your phone number and password to continue.",
    registerTitle: "Create your Hidden account",
    registerDescription: "Registration is invite-only in the first release.",
    countryCode: "Country code",
    phoneNumber: "Phone number",
    phonePlaceholder: "138 0013 8000",
    phoneHelper:
      "Enter the local number without the international prefix.",
    password: "Password",
    inviteCode: "Invite code",
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
    defaultDescription: "Ask something thoughtful and keep it anonymous.",
    pausedNotice:
      "This box is visible, but the owner has paused new submissions.",
    publishedAnswersTitle: "Published answers",
    publishedAnswersDescription:
      "Only questions the owner has chosen to publish appear here.",
    noAnswers: "No public answers yet.",
    publishedAt: "Published {value}",
    questionTitle: "Question",
    answerTitle: "Answer",
    questionAttachmentAlt: "Question attachment",
    answerAttachmentAlt: "Answer attachment",
  },
  publicQuestionForm: {
    success:
      "Question received. It will stay private until the owner reviews it.",
    questionLabel: "Your anonymous question",
    imageHelper:
      "Optional image, up to 5 MB. JPG, PNG, and WEBP are supported.",
    attachImage: "Attach image",
    submit: "Send anonymously",
    submitting: "Submitting...",
    submitError: "Unable to submit question.",
  },
  dashboard: {
    lightMode: "Light",
    darkMode: "Dark",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    accountInfoTitle: "Account information",
    accountInfoDescription:
      "This section shows the basic details of the currently signed-in account.",
    themeTitle: "Theme",
    themeDescription:
      "You can switch the user dashboard between light and dark at any time.",
    languageTitle: "Language",
    languageDescription:
      "Choose the language for the public site, sign-in flow, and user dashboard.",
    currentMode: "Current mode: {mode}",
    themeScope:
      "This only affects the user dashboard. The public site follows your language preference but keeps its own theme.",
    accountPhone: "Phone: {phone}",
    accountRole: "Role: {role}",
    accountCreatedAt: "Created: {value}",
    passwordTitle: "Change password",
    passwordDescription:
      "After you update your password, old sessions on other devices will be signed out.",
    logoutTitle: "Sign out",
    logoutDescription:
      "Use this when you want to safely sign out from the current device.",
    myBoxesTitle: "My boxes",
    myBoxesDescription:
      "Open any box from here to review incoming questions and continue managing it.",
    noBoxesTitle: "No boxes yet",
    noBoxesDescription:
      "Create your first box and it will appear here once it is ready.",
    newBoxPageTitle: "New box",
    newBoxTitle: "Launch a new question box",
    newBoxDescription:
      "Fill in the name, link, and visibility settings, then share it right away.",
    existingBoxesTitle: "Your existing boxes",
    existingBoxesDescription:
      "If you only need to continue managing an existing box, jump in here.",
    existingBoxesEmptyTitle: "Nothing here yet",
    existingBoxesEmptyDescription:
      "After you publish your first box, it will start showing up here.",
    createdPageTitle: "Box created",
    createdDescription:
      "Your box is ready. Share the link now or jump straight into management.",
    createdSuccess: "Created successfully",
    detailSettingsAria: "Question box settings",
    metricTotalQuestions: "Total questions",
    metricPendingQuestions: "Pending questions",
    metricPublishedQuestions: "Published questions",
    metricAccepting: "Still accepting new questions",
    metricPaused: "Currently paused",
    detailQuestionsTitle: "Questions",
    detailQuestionsDescription:
      "Incoming questions appear here. You can answer them and decide whether to publish or hide them.",
    noQuestionsTitle: "No questions yet",
    noQuestionsDescription:
      "Questions will appear here after someone submits to this box.",
    settingsTitle: "Box settings",
    settingsDescription:
      "Update the title, description, link, visibility, and submission status here.",
    backToQuestions: "Back to questions",
    publicPageTitle: "Public page",
    publicPageDescription:
      "This is the page others see when they submit questions.",
    summaryTitle: "Current summary",
    summaryDescription:
      "A quick view of this question box's current state.",
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
      title: "Box title",
      description: "Description",
      slug: "Public slug",
      slugHelper: "Public URLs use /b/[slug].",
      wallpaperHelper:
        "Optionally upload a wallpaper for the public question page header. Uploading a new image replaces the old one.",
      wallpaperAlt: "Current box wallpaper",
      uploadWallpaper: "Upload wallpaper",
      keepWallpaper: "Keep current wallpaper",
      noWallpaper: "No wallpaper selected",
      removeWallpaper: "Remove current wallpaper",
      restoreWallpaper: "Restore current wallpaper",
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
      sharePage: "Share page",
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
      blockError: "Unable to block the question.",
      blockedSuccess: "Question blocked.",
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
      intro: "Update your password to keep this account secure.",
      description:
        "After the change, Hidden keeps this device signed in and signs out your other active sessions.",
      currentPassword: "Current password",
      newPassword: "New password",
      newPasswordHelper: "Use 8 to 72 characters.",
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
      helper:
        "Your choice is saved in this browser and also applies to the public site next time you visit.",
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
    SLUG_TAKEN: "Slug is already taken.",
    BOX_NOT_FOUND: "Question box not found.",
    QUESTION_NOT_FOUND: "Question not found.",
    QUESTION_REJECTED: "Rejected questions cannot be changed this way.",
    ANSWER_REQUIRED: "Add an answer before publishing.",
    BOX_CLOSED: "This box is not accepting new questions.",
    RATE_LIMITED:
      "Too many submissions from this address. Please try again later.",
    INVALID_FILE_TYPE: "Only JPG, PNG, or WEBP images are allowed.",
    FILE_TOO_LARGE: "Image size must stay below 5 MB.",
    VALIDATION_ERROR: "Please check the submitted fields.",
    INTERNAL_SERVER_ERROR: "Internal server error",
  },
  validation: {
    phoneInvalid: "Enter a valid phone number.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordTooLong: "Password is too long.",
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
