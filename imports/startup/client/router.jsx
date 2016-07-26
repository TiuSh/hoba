import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import { mount } from 'react-mounter';

// Layouts

// Containers
import AppLayoutContainer from '../../ui/containers/AppLayoutContainer.jsx';
import LoginPageContainer from '../../ui/containers/LoginPageContainer.jsx';
import ExplorerPageContainer from '../../ui/containers/ExplorerPageContainer.jsx';

// Pages
import NotFound from '../../ui/pages/NotFound.jsx';


// Login page
FlowRouter.route('/', {
  name: 'homepage',
  action() {
    mount(AppLayoutContainer, {
      content() {
        return <LoginPageContainer />;
      },
    });
  },
});

// If a gallery is not found
FlowRouter.route('/notfound', {
  name: 'notfound',
  action() {
    mount(AppLayoutContainer, {
      content() {
        return <NotFound />;
      },
    });
  },
});

// User gallery
FlowRouter.route('/:userId/:path*', {
  name: 'gallery',
  action(params, queryParams) {
    mount(AppLayoutContainer, {
      content() {
        return (
          <ExplorerPageContainer
            params={params}
            queryParams={queryParams}
          />
        );
      },
    });
  },
});

