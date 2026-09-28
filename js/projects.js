const BADGE_HTML = {
  wakatime_user: '<a href="https://wakatime.com/@8a272fcb-113b-4d48-b227-e717ab94571a"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a.svg" alt="Total time coded since Feb 11 2015" /></a>',
  wakatime_yearly: '<img src="https://camo.githubusercontent.com/1f36fad378243c766e543e59aed261a5cbabada25f46066e55d601804f9e6c11/68747470733a2f2f77616b6174696d652e636f6d2f73686172652f40756574696b6f2f37326638383765382d643830642d343032322d393163362d3434646463626137633866352e706e67" alt="Coding activity" width="600px" style="max-width:100%">',
  github_stats: '<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/uetiko"><img src="https://camo.githubusercontent.com/725a1c154d1d4c64ddac1f14372a2ce8f442affa823469f257da933a21d05a48/68747470733a2f2f6769746875622d726561646d652d73746174732e76657263656c2e6170702f6170693f757365726e616d653d756574696b6f2673686f775f69636f6e733d74727565" alt="uetiko github stats" style="max-width:100%;"></a>',
  wakatime_eladio: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/6d2cd5d8-2d27-4977-ad44-6156cd050b9c"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/6d2cd5d8-2d27-4977-ad44-6156cd050b9c.svg" alt="wakatime"></a>',
  wakatime_stoyco_aws: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/be7a8e5d-2037-4ab7-adf9-a1eb4d27cd91"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/be7a8e5d-2037-4ab7-adf9-a1eb4d27cd91.svg" alt="wakatime"></a>',
  wakatime_stoyco_db: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e77ba-493c-468d-bca0-8bc28233c079"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e77ba-493c-468d-bca0-8bc28233c079.svg" alt="wakatime"></a>',
  wakatime_stoyco_scripts: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/acbf0d75-3e83-4a08-a5f5-c34b0bbcb68f"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/acbf0d75-3e83-4a08-a5f5-c34b0bbcb68f.svg" alt="wakatime"></a>',
  wakatime_stoyco_core: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e1b6f-dae8-4cb3-aa67-5dadc962c57d"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e1b6f-dae8-4cb3-aa67-5dadc962c57d.svg" alt="wakatime"></a>',
  wakatime_stoyco_user: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/0787bcd2-6c67-42e7-bacd-332ab40adc90"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/0787bcd2-6c67-42e7-bacd-332ab40adc90.svg" alt="wakatime"></a>',
  wakatime_stoyco_backoffice: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e3e0a-25c5-45f6-9d17-7f6799e24ee0"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/018e3e0a-25c5-45f6-9d17-7f6799e24ee0.svg" alt="wakatime"></a>',
  wakatime_stoyco_queue: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/0fcc38b9-2d7f-49ee-b5c0-ffa536c37fe3"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/0fcc38b9-2d7f-49ee-b5c0-ffa536c37fe3.svg" alt="wakatime"></a>',
  wakatime_cityexpress_backend: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/cf4a7486-e86c-48be-aa66-5287f23a4e40"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/cf4a7486-e86c-48be-aa66-5287f23a4e40.svg" alt="wakatime"></a>',
  wakatime_cityexpress_frontend: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/ef7e5e89-6788-4f38-82e7-67f4f5c546eb"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/ef7e5e89-6788-4f38-82e7-67f4f5c546eb.svg" alt="wakatime"></a>',
  wakatime_vass_wiki: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/ed56c836-1a05-4d96-9bba-3d1461326bca"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/ed56c836-1a05-4d96-9bba-3d1461326bca.svg" alt="wakatime"></a>',
  wakatime_vass_magento: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/5b0b8537-7c4a-40d3-a782-d72f25d9820e"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/5b0b8537-7c4a-40d3-a782-d72f25d9820e.svg" alt="wakatime"></a>',
  wakatime_vass_bancostado: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/3b9407cd-283b-4dce-a6a9-d86392b100f2"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/3b9407cd-283b-4dce-a6a9-d86392b100f2.svg" alt="wakatime"></a>',
  wakatime_enova_mako: '<a href="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/3caf4d19-3057-4614-b57f-69a9a347eaaa"><img src="https://wakatime.com/badge/user/8a272fcb-113b-4d48-b227-e717ab94571a/project/3caf4d19-3057-4614-b57f-69a9a347eaaa.svg" alt="wakatime"></a>'
};

const ProjectsBadges = {
  props: ['t', 'telemetry'],
  data() { return { badges: BADGE_HTML }; },
  template: `
    <article>
      <h2>{{ t('projects.title') }}</h2>
      <div class="projects-grid">
        <section v-for="group in t('projects.groups')" :key="group.heading" class="project-group">
          <h3>{{ group.heading }}</h3>
          <div class="project-list"><div v-for="item in group.items" :key="item.title" class="project"><h4>{{ item.title }}</h4><p v-if="item.desc" class="desc">{{ item.desc }}</p><p v-if="item.badge && badges[item.badge]" class="usage" v-html="badges[item.badge]"></p></div></div>
        </section>
      </div>
    </article>
  `
};

const Projects = ProjectsBadges;

export { BADGE_HTML, Projects, ProjectsBadges };
