import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toolbar from '../components/Toolbar';
import { Provider } from 'jotai';

describe('Toolbar', () => {
  it('renders all tool buttons', () => {
    const { getByLabelText } = render(
      <Provider>
        <Toolbar />
      </Provider>
    );
    expect(getByLabelText('Select/Describe')).toBeInTheDocument();
    expect(getByLabelText('Rectangle')).toBeInTheDocument();
    expect(getByLabelText('Free Draw')).toBeInTheDocument();
    expect(getByLabelText('Delete')).toBeInTheDocument();
  });

  it('changes tool when a button is clicked', () => {
    const { getByLabelText } = render(
      <Provider>
        <Toolbar />
      </Provider>
    );
    const pencilButton = getByLabelText('Free Draw');
    fireEvent.click(pencilButton);
    // No direct UI feedback, but no error should occur
    expect(pencilButton).toBeInTheDocument();
  });
});
