#!/usr/bin/perl
use strict;
use JSON;

my $posts = from_json(join('', <>));

foreach my $post (@$posts) {

    my $file = $post->{slug};
    $file =~ s/\W+/-/g;
    $file .= '.md';

    print $file, "\n";

    my $date = sprintf "%4.4d-%2.2d-%2.2d", $post->{year}, $post->{month}, $post->{day};
    my @tags = ();
    @tags = @{$post->{tags_array}} if ref $post->{tags_array} eq 'ARRAY';

    $post->{content} =~ s((https?://(www\.)?athega\.se)?/system/uploads/)(https://athega.se/system/uploads/)g;

    open MD, '>', $file or die $!;
    print MD "---\n";
    print MD "title: \"", $post->{title}, "\"\n" if $post->{title};
    print MD "date: ", $date, "\n";
    print MD "description: \"", $post->{summary}, "\"\n" if $post->{summary};
    print MD "tags:\n", map("  - $_\n", @tags) if @tags;
    print MD "last_updated_by: ", $post->{last_updated_by}, "\n" if $post->{last_updated_by};
    print MD "image_url: ", $post->{image_url}, "\n" if $post->{image_url};
    print MD "---\n";
    print MD $post->{content}, "\n";
    close MD;
}
